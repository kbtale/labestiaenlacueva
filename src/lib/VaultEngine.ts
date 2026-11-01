import * as THREE from 'three';

export interface ArchiveItem {
  id: string;
  title: string;
  playlist: string;
  tags: string[];
  slot: number;
  atlas: number;
  mean: [number, number, number];
}

interface ArchiveDataset {
  version: number;
  period: number;
  D0: number;
  cols: number;
  rows: number;
  cell: [number, number];
  aspect: number;
  atlases: Array<{ src: string; cols: number; rows: number }>;
  entries: ArchiveItem[];
  cells: Array<[number, number, number, number, number, number, number, number, number, number]>;
  seq: number[];
}

function flow(x: number, y: number, t: number): [number, number] {
  return [
    Math.sin(y * 0.045 + t * 0.35) + 0.6 * Math.sin((x + y) * 0.03 - t * 0.27),
    Math.cos(x * 0.045 - t * 0.31) + 0.6 * Math.cos((x - y) * 0.03 + t * 0.23)
  ];
}

function rng(a: number, b: number) {
  let t = (a * 374761393 + b * 668265263) >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const RUNWAY = {
  step: 38,
  h: 7.8,
  x: 10,
  y: 6,
  z0: 220,
  n: 52,
  rx: 24,
  ry: 18
};

const VORTEX_RADIUS = 150.0;
const CYCLE_PERIOD = 1384.0;
const PXB = 5.5e6;

const SLICE_WORKER_CODE = `self.onmessage = async (e) => {
  const { id, url, strip } = e.data;
  try {
    const res = await fetch(url);
    const total = +res.headers.get("Content-Length") || 0;
    const rd = res.body && res.body.getReader();
    const parts = [];
    let got = 0;
    if (rd) {
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        parts.push(value);
        got += value.length;
        if (total) self.postMessage({ id, p: [got, total] });
      }
    }
    const blob = rd ? new Blob(parts) : await res.blob();
    const bmp = await createImageBitmap(blob, { imageOrientation: "flipY", premultiplyAlpha: "none", colorSpaceConversion: "none" });
    const W = bmp.width;
    const H = bmp.height;
    const n = Math.floor(Math.log2(Math.max(W, H)));
    const levels = [];
    const tr = [];
    let lvl = bmp;
    for (let l = 0; l <= n; l++) {
      if (l) lvl = await createImageBitmap(lvl, { resizeWidth: Math.max(1, W >> l), resizeHeight: Math.max(1, H >> l), resizeQuality: "medium" });
      const w = lvl.width;
      const h = lvl.height;
      const rows = Math.max(1, Math.floor(strip / (w * 4)));
      const subParts = [];
      for (let y = 0; y < h; y += rows) {
        const s = await createImageBitmap(lvl, 0, y, w, Math.min(rows, h - y));
        subParts.push([y, s]);
        tr.push(s);
      }
      levels.push(subParts);
    }
    self.postMessage({ id, W, H, levels }, tr);
  } catch (err) {
    self.postMessage({ id, err: String(err) });
  }
};`;

export class VaultEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private field: THREE.Group;
  private data: ArchiveDataset | null = null;
  private mesh: THREE.InstancedMesh | null = null;
  private onHoverCallback: (item: ArchiveItem | null, pos?: { x: number; y: number }) => void;
  private onSelectCallback: (item: ArchiveItem) => void;
  private onDistChangeCallback?: (dist: number, activeItem?: ArchiveItem | null) => void;
  private onProgressCallback?: (progress: number) => void;
  
  private W = 0;
  private H = 0;
  private dpr = 1;
  private dist = 0;
  private targetDist = 0;
  private velocity = 0;
  private lastTime = performance.now();
  private isInteracting = false;
  private pointerDownPos = { x: 0, y: 0, time: 0 };
  private pointerCurrentPos = { x: -1000, y: -1000, inCanvas: false };
  private mouseNorm = { x: 0, y: 0 };
  private drift = { x: 0, y: 0 };
  private rewind: { from: number; t0: number; dur: number } | null = null;
  
  private fr = { cx: 0, cy: 0, w: 0, h: 0, ready: false };
  private isDrawerOpen = false;
  private isSectionModalOpen = false;

  private hoveredIndex = -1;
  private activeFilter: string | null = null;
  private softFactor = 0;
  private targetSoft = 0;
  private isDestroyed = false;
  private rafId = 0;
  private grow = 0;
  private dirty = false;
  
  private N = 0;
  private totalCapacity = 0;
  private runwayK: Int32Array = new Int32Array(RUNWAY.n);
  private tileEpoch: Int32Array = new Int32Array(0);
  private tileItem: Int32Array = new Int32Array(0);
  private epochCache: Map<number, number> = new Map();
  private floaters: number[] = [];

  private attrSlot!: THREE.InstancedBufferAttribute;
  private attrColor!: THREE.InstancedBufferAttribute;
  private attrMean!: THREE.InstancedBufferAttribute;
  private attrDim!: THREE.InstancedBufferAttribute;
  private attrFill!: THREE.InstancedBufferAttribute;
  private attrFilterDim!: THREE.InstancedBufferAttribute;
  private attrCase!: THREE.InstancedBufferAttribute;
  private attrRunway!: THREE.InstancedBufferAttribute;

  private m4 = new THREE.Matrix4();
  private qI = new THREE.Quaternion();
  private vS = new THREE.Vector3();

  private sliceJobs: Array<{
    glTex: WebGLTexture;
    list: Array<[number, number, ImageBitmap]>;
    isBaseLevel: boolean;
  }> = [];

  private world: Array<{
    pos: THREE.Vector3;
    base: THREE.Vector3;
    h: number;
    h0: number;
    hs: number;
    hideFly: boolean;
    float?: [number, number, number, number, number];
    from?: THREE.Vector3;
    delay?: number;
    dur?: number;
  }> = [];
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();

  private introStart = -1;
  private introEnd = 0;
  private introDone = false;
  private vIntroPos = new THREE.Vector3();
  private vIntroTg = new THREE.Vector3();

  private uniforms = {
    uShift: { value: 0 },
    uFog: { value: 0 },
    uBlur: { value: 0 },
    uBg: { value: new THREE.Vector3(0.039, 0.039, 0.043) },
    uSoft: { value: 0 },
    uTime: { value: 0 },
    uGrid: { value: new THREE.Vector2(16, 21) },
    uTilePx: { value: new THREE.Vector2(256, 192) },
    uHover: { value: -1 },
    uMap: { value: null as THREE.Texture | null }
  };

  constructor(
    canvas: HTMLCanvasElement,
    onHover: (item: ArchiveItem | null, pos?: { x: number; y: number }) => void,
    onSelect: (item: ArchiveItem) => void,
    onDistChange?: (dist: number, activeItem?: ArchiveItem | null) => void,
    onProgress?: (progress: number) => void
  ) {
    this.canvas = canvas;
    this.onHoverCallback = onHover;
    this.onSelectCallback = onSelect;
    this.onDistChangeCallback = onDistChange;
    this.onProgressCallback = onProgress;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.dpr < 1.5,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 8000);
    this.field = new THREE.Group();
    this.scene.add(this.field);

    this.handleResize = this.handleResize.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderLoop = this.renderLoop.bind(this);

    this.attachEvents();
    this.init();
  }

  private async init() {
    try {
      this.onProgressCallback?.(0.15);
      const resp = await fetch('/data/archive.json');
      this.data = (await resp.json()) as ArchiveDataset;
      this.onProgressCallback?.(0.45);
      await this.loadAtlasTexture();
      this.onProgressCallback?.(0.85);
      this.buildMesh();
      this.handleResize();
      this.onProgressCallback?.(1.0);
      this.rafId = requestAnimationFrame(this.renderLoop);
    } catch {}
  }

  private async loadAtlasTexture() {
    if (!this.data) return;
    const isSmall = Math.min(window.innerWidth, window.innerHeight) < 600 && this.dpr < 2;
    const src = isSmall ? '/atlas/archive-0-sm.webp' : '/atlas/archive-0.webp';
    const tileW = isSmall ? 128 : 256;
    const tileH = isSmall ? 96 : 192;
    this.uniforms.uTilePx.value.set(tileW, tileH);

    const gl = this.renderer.getContext();
    const isWebGL2 = this.renderer.capabilities.isWebGL2;

    if (isWebGL2 && typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') {
      try {
        const workerBlob = new Blob([SLICE_WORKER_CODE], { type: 'text/javascript' });
        const workerUrl = URL.createObjectURL(workerBlob);
        const worker = new Worker(workerUrl);

        const data = await new Promise<{ W: number; H: number; levels: Array<Array<[number, ImageBitmap]>> } | null>((resolve) => {
          worker.onmessage = (e) => {
            if (e.data.p && this.onProgressCallback) {
              const [got, total] = e.data.p;
              this.onProgressCallback(0.45 + (got / total) * 0.4);
            } else if (e.data.levels) {
              resolve(e.data);
            } else {
              resolve(null);
            }
          };
          worker.postMessage({ id: 1, url: src, strip: 1048576 });
        });

        if (data && data.levels) {
          const glTex = gl.createTexture()!;
          const st = this.renderer.state;
          const n = data.levels.length;
          st.bindTexture(gl.TEXTURE_2D, glTex);
          gl.texStorage2D(gl.TEXTURE_2D, n, gl.RGBA8, data.W, data.H);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 1);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, n - 1);
          const ext = gl.getExtension("EXT_texture_filter_anisotropic");
          if (ext) {
            const maxAniso = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 4;
            gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(maxAniso, 8));
          }
          st.unbindTexture();

          const tex = new THREE.Texture();
          tex.image = { width: data.W, height: data.H };
          tex.flipY = false;
          const props = this.renderer.properties.get(tex);
          props.__webglTexture = glTex;
          props.__webglInit = true;
          this.uniforms.uMap.value = tex;

          const smallStrips: Array<[number, number, ImageBitmap]> = [];
          for (let l = n - 1; l >= 1; l--) {
            for (const [y, b] of data.levels[l]) {
              smallStrips.push([l, y, b]);
            }
          }
          this.sliceJobs.push({ glTex, list: smallStrips, isBaseLevel: false });

          const baseStrips: Array<[number, number, ImageBitmap]> = [];
          for (const [y, b] of data.levels[0]) {
            baseStrips.push([0, y, b]);
          }
          this.sliceJobs.push({ glTex, list: baseStrips, isBaseLevel: true });
          return;
        }
      } catch {}
    }

    const loader = new THREE.TextureLoader();
    const tex = await loader.loadAsync(src);
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    this.uniforms.uMap.value = tex;
  }

  private drainSliceJobs() {
    if (!this.sliceJobs.length) return;
    const job = this.sliceJobs[0];
    if (!job.list.length) {
      this.sliceJobs.shift();
      return;
    }

    const gl = this.renderer.getContext();
    const st = this.renderer.state;
    const [l, y, b] = job.list.shift()!;

    st.bindTexture(gl.TEXTURE_2D, job.glTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texSubImage2D(gl.TEXTURE_2D, l, 0, y, b.width, b.height, gl.RGBA, gl.UNSIGNED_BYTE, b);
    try { b.close(); } catch {}

    if (!job.list.length && job.isBaseLevel) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
      const ext = gl.getExtension("EXT_texture_filter_anisotropic");
      if (ext) {
        const maxAniso = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 4;
        gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(maxAniso, 8));
      }
      this.sliceJobs.shift();
    }
    st.unbindTexture();
  }

  private buildMesh() {
    if (!this.data) return;
    const D = this.data;
    this.N = D.cells.length;
    this.totalCapacity = this.N + RUNWAY.n;

    this.tileEpoch = new Int32Array(this.totalCapacity).fill(-1);
    this.tileItem = new Int32Array(this.totalCapacity).fill(-1);
    this.runwayK = new Int32Array(RUNWAY.n).fill(-1);

    const geo = new THREE.PlaneGeometry(D.cell[0] / D.cell[1], 1);
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -1000), 100000);

    const vertShader = `
      attribute vec2 aSlot;
      attribute vec3 aColor;
      attribute vec3 aMean;
      attribute float aDim;
      attribute float aFill;
      attribute float aFilterDim;
      attribute float aCase;
      attribute float aRunway;
      
      uniform vec2 uGrid;
      uniform float uHover;
      uniform float uBlur;
      uniform vec2 uTilePx;
      uniform float uSoft;
      uniform float uFog;
      
      varying vec2 vUv;
      varying vec2 vLocal;
      varying vec3 vColor;
      varying vec3 vMean;
      varying float vFade;
      varying float vDepth;
      varying float vHover;
      varying float vDim;
      varying float vFill;
      varying float vFilterDim;
      varying float vBias;
      varying float vCase;
      
      void main() {
        vec4 mv = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
        float s = length(instanceMatrix[1].xyz);
        float d = -mv.z;
        vFade = smoothstep(s * 1.1, s * 2.6, d);
        vFade *= aRunway > 0.5 ? smoothstep(0.12, 0.65, uFog) : 1.0;
        vDepth = d;
        vLocal = uv;
        vBias = uBlur * pow(smoothstep(120.0, 1800.0, d), 1.2) * 2.2 + uSoft * 0.5;
        vec2 pad = 0.5 * exp2(vBias) / uTilePx + 0.002;
        vec2 inset = mix(pad, 1.0 - pad, uv);
        vUv = vec2((aSlot.x + inset.x) / uGrid.x, 1.0 - (aSlot.y + 1.0 - inset.y) / uGrid.y);
        vColor = aColor;
        vMean = aMean;
        vDim = aDim;
        vFill = aFill;
        vFilterDim = aFilterDim;
        vCase = aCase;
        vHover = abs(float(gl_InstanceID) - uHover) < 0.5 ? 1.0 : 0.0;
        gl_Position = projectionMatrix * mv;
      }
    `;

    const fragShader = `
      uniform sampler2D uMap;
      uniform float uShift;
      uniform float uFog;
      uniform vec3 uBg;
      uniform float uSoft;
      uniform float uTime;
      uniform vec2 uGrid;
      
      varying vec2 vUv;
      varying vec2 vLocal;
      varying vec3 vColor;
      varying vec3 vMean;
      varying float vFade;
      varying float vDepth;
      varying float vHover;
      varying float vDim;
      varying float vFill;
      varying float vFilterDim;
      varying float vBias;
      varying float vCase;
      
      float ign(vec2 p) {
        return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
      }
      
      void main() {
        float a = vFade * (1.0 - vFill * smoothstep(0.0, 0.6, uFog));
        if (a < 0.999 && ign(gl_FragCoord.xy) > a) discard;
        vec2 q = abs((vLocal - 0.5) * vec2(1.3333, 1.0)) - vec2(0.6667, 0.5) + 0.06;
        if (length(max(q, 0.0)) > 0.06) discard;
        vec3 c = texture2D(uMap, vUv, vBias).rgb;
        c = clamp(c + (vColor - vMean) * uShift, 0.0, 1.0);
        c = mix(uBg, c, vDim);
        c = mix(c * 0.15, c, vFilterDim);
        float edge = min(min(vLocal.x, 1.0 - vLocal.x), min(vLocal.y, 1.0 - vLocal.y));
        if (vHover > 0.5) {
          c = mix(c, vec3(1.0), 0.18);
          if (edge < 0.025) c = vec3(1.0);
        }
        if (vCase > 0.0) {
          float t = fract(uTime * 0.14 + vCase * 7.0);
          float p = vLocal.x * 0.75 + (1.0 - vLocal.y) * 0.5;
          float pos = t * 2.0 - 0.4;
          float band = exp(-pow((p - pos) / 0.06, 2.0)) * 0.55 + exp(-pow((p - pos) / 0.2, 2.0)) * 0.16;
          float inner = smoothstep(0.1, 0.0, edge) * (0.14 + 0.07 * sin(uTime * 1.6 + vCase * 30.0));
          c += vec3(1.0, 0.98, 0.95) * (band + inner) * uFog * (1.0 - smoothstep(110.0, 190.0, vDepth));
        }
        c = mix(c, uBg, smoothstep(850.0, 2400.0, vDepth) * uFog);
        c = mix(c, uBg, uSoft * 0.45);
        gl_FragColor = vec4(c, 1.0);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: this.uniforms
    });

    this.mesh = new THREE.InstancedMesh(geo, mat, this.totalCapacity);
    this.mesh.frustumCulled = false;

    this.attrSlot = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity * 2), 2);
    this.attrColor = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity * 3), 3);
    this.attrMean = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity * 3), 3);
    this.attrDim = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity).fill(1), 1);
    this.attrFill = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity), 1);
    this.attrFilterDim = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity).fill(1), 1);
    this.attrCase = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity), 1);
    this.attrRunway = new THREE.InstancedBufferAttribute(new Float32Array(this.totalCapacity), 1);

    this.attrSlot.setUsage(THREE.DynamicDrawUsage);
    this.attrColor.setUsage(THREE.DynamicDrawUsage);
    this.attrMean.setUsage(THREE.DynamicDrawUsage);
    this.attrDim.setUsage(THREE.DynamicDrawUsage);
    this.attrFill.setUsage(THREE.DynamicDrawUsage);
    this.attrFilterDim.setUsage(THREE.DynamicDrawUsage);
    this.attrCase.setUsage(THREE.DynamicDrawUsage);
    this.attrRunway.setUsage(THREE.DynamicDrawUsage);

    geo.setAttribute('aSlot', this.attrSlot);
    geo.setAttribute('aColor', this.attrColor);
    geo.setAttribute('aMean', this.attrMean);
    geo.setAttribute('aDim', this.attrDim);
    geo.setAttribute('aFill', this.attrFill);
    geo.setAttribute('aFilterDim', this.attrFilterDim);
    geo.setAttribute('aCase', this.attrCase);
    geo.setAttribute('aRunway', this.attrRunway);

    this.world = [];
    this.floaters = [];

    for (let i = 0; i < this.N; i++) {
      const c = D.cells[i];
      const w = {
        pos: new THREE.Vector3(),
        base: new THREE.Vector3(),
        h: 0,
        h0: 0,
        hs: 1,
        hideFly: false,
        float: undefined as [number, number, number, number, number] | undefined
      };

      const isHalo = c[9] !== 1 && (c[8] ?? 1) < 0.6;
      if (isHalo) {
        const seed = (i * 137.5) % 1;
        w.float = [0.04 + seed * 0.05, 0, seed, i * 0.35, 18 + seed * 25];
        this.floaters.push(i);
      }

      this.world[i] = w;
      this.attrColor.setXYZ(i, c[1] / 255, c[2] / 255, c[3] / 255);
      this.attrRunway.setX(i, 0);
      this.setEpoch(i, 0);
    }

    for (let s = 0; s < RUNWAY.n; s++) {
      const i = this.N + s;
      this.world[i] = {
        pos: new THREE.Vector3(0, 0, 1e7),
        base: new THREE.Vector3(0, 0, 1e7),
        h: 0,
        h0: RUNWAY.h,
        hs: 1,
        hideFly: false
      };
      this.attrDim.setX(i, 1);
      this.attrFill.setX(i, 0);
      this.attrFilterDim.setX(i, 1);
      this.attrRunway.setX(i, 1);
      this.vS.set(0, 0, 1);
      this.mesh.setMatrixAt(i, this.m4.compose(this.world[i].pos, this.qI, this.vS));
    }

    this.updateRunway();
    this.flush();
    this.field.add(this.mesh);
  }

  private setImage(i: number, itemIdx: number) {
    if (this.tileItem[i] === itemIdx) return;
    this.tileItem[i] = itemIdx;
    if (itemIdx < 0 || !this.data) return;

    const item = this.data.entries[itemIdx];
    if (!item) return;

    const col = item.slot % 16;
    const row = Math.floor(item.slot / 16);
    this.attrSlot.setXY(i, col, row);
    this.attrMean.setXYZ(i, item.mean[0] / 255, item.mean[1] / 255, item.mean[2] / 255);
    this.dirty = true;
  }

  private place(i: number, epoch: number) {
    if (!this.data) return;
    const D = this.data;
    const c = D.cells[i];
    const d = c[4];
    const w = this.world[i];

    if (epoch === 0) {
      const col = c[5];
      const row = c[6];
      const k = d / D.D0;
      w.h0 = D.cell[1] * k * 0.94;
      w.hs = c[7] ?? 1;
      w.h = w.h0 * (w.hs + (1 - w.hs) * this.grow);
      if (c[9] === 1) {
        w.h0 = 0;
        w.h = 0;
      }
      w.pos.set(
        (col + 0.5 - D.cols / 2) * D.cell[0] * k,
        (D.rows / 2 - row - 0.5) * D.cell[1] * k,
        -d
      );
      w.base.copy(w.pos);
      w.hideFly = !!c[9] || (Math.abs(w.pos.x) < RUNWAY.rx && Math.abs(w.pos.y) < RUNWAY.ry);
      this.attrDim.setX(i, c[9] === 1 ? 0 : (c[8] ?? 1));
      this.attrFill.setX(i, w.hideFly ? 1 : 0);
      this.attrCase.setX(i, 0);
    } else {
      const r = rng(i + 1, epoch);
      const k = (d + epoch * CYCLE_PERIOD) / D.D0;
      const col = c[5];
      const row = c[6];
      const jx = (r() - 0.5) * 6.0 * k;
      const jy = (r() - 0.5) * 6.0 * k;
      w.pos.set(
        (col + 0.5 - D.cols / 2) * D.cell[0] * k + jx,
        (D.rows / 2 - row - 0.5) * D.cell[1] * k + jy,
        -(d + epoch * CYCLE_PERIOD)
      );
      w.base.copy(w.pos);
      w.h0 = D.cell[1] * k * 0.94;
      w.hs = c[7] ?? (0.65 + r() * 0.7);
      w.h = w.h0 * w.hs;
      const inLane = Math.abs(w.pos.x) < RUNWAY.rx * 0.65 && Math.abs(w.pos.y) < RUNWAY.ry * 0.65;
      w.hideFly = inLane;
      this.attrDim.setX(i, 1.0);
      this.attrFill.setX(i, inLane ? 1 : 0);
      this.attrCase.setX(i, 0);
    }

    this.vS.set(w.h, w.h, 1);
    this.mesh!.setMatrixAt(i, this.m4.compose(w.pos, this.qI, this.vS));
  }

  private setEpoch(i: number, epoch: number) {
    if (this.tileEpoch[i] === epoch) return;
    this.tileEpoch[i] = epoch;
    this.place(i, epoch);

    let itemIdx: number;
    if (epoch === 0) {
      itemIdx = this.data!.cells[i][0] % this.data!.entries.length;
    } else if (!this.world[i].h) {
      itemIdx = -1;
    } else {
      const key = epoch * this.N + i;
      const cached = this.epochCache.get(key);
      if (cached !== undefined) {
        itemIdx = cached;
      } else {
        const M = this.data!.seq.length;
        const r = rng(i + 3, epoch);
        const ahead = this.runwayIndexAt(-this.world[i].pos.z);
        const k = (ahead + 10 + Math.floor(r() * 40)) % M;
        itemIdx = this.data!.seq[k] % this.data!.entries.length;
        this.epochCache.set(key, itemIdx);
      }
    }

    this.setImage(i, itemIdx);
    this.dirty = true;
  }

  private runwayIndexAt(z: number): number {
    return Math.max(0, Math.floor((z - RUNWAY.z0) / RUNWAY.step));
  }

  private updateRunway() {
    if (!this.data || !this.mesh) return;
    const first = Math.max(0, this.runwayIndexAt(this.dist) - 1);
    const M = this.data.seq.length;
    const numEntries = this.data.entries.length;

    for (let k = first; k < first + RUNWAY.n; k++) {
      const s = k % RUNWAY.n;
      const i = this.N + s;
      if (this.runwayK[s] === k) continue;
      this.runwayK[s] = k;

      const r = rng(k + 11, 99);
      const w = this.world[i];
      const a = r() * Math.PI * 2;
      const rr = Math.sqrt(r());
      w.h = RUNWAY.h * (0.85 + r() * 0.3);
      w.pos.set(
        Math.cos(a) * rr * RUNWAY.x,
        Math.sin(a) * rr * RUNWAY.y,
        -(RUNWAY.z0 + k * RUNWAY.step)
      );

      this.vS.set(w.h, w.h, 1);
      this.mesh.setMatrixAt(i, this.m4.compose(w.pos, this.qI, this.vS));

      const seqIdx = this.data.seq[k % M];
      const itemIdx = seqIdx % numEntries;
      this.setImage(i, itemIdx);
      this.attrCase.setX(i, ((k % 11) + 1) * 0.1);
      this.dirty = true;
    }
  }

  private cycleEpochs() {
    if (!this.data) return;
    const D = this.data;
    for (let i = 0; i < this.N; i++) {
      const d = D.cells[i][4];
      const epoch = this.dist > d ? Math.ceil((this.dist - d) / CYCLE_PERIOD) : 0;
      if (epoch !== this.tileEpoch[i]) {
        this.setEpoch(i, epoch);
      }
    }
  }

  private flush() {
    if (!this.dirty || !this.mesh) return;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.attrSlot.needsUpdate = true;
    this.attrMean.needsUpdate = true;
    this.attrDim.needsUpdate = true;
    this.attrFill.needsUpdate = true;
    this.attrCase.needsUpdate = true;
    this.attrRunway.needsUpdate = true;
    this.dirty = false;
  }

  private stage(dt: number) {
    if (!this.data) return;
    const wide = this.W > 860;
    const openPlayer = this.isDrawerOpen;
    const openSection = this.isSectionModalOpen;

    let x0 = 0;
    let x1 = this.W;
    let y0 = Math.max(70, this.H * 0.085);
    let y1 = this.H * 1.07;

    if (openPlayer) {
      if (wide) {
        x1 = Math.max(this.W * 0.4, this.W - 580);
      } else {
        y1 = this.H * 0.45;
      }
    } else if (openSection) {
      if (wide) {
        x0 = Math.min(this.W * 0.55, 620);
      } else {
        y0 = this.H * 0.45;
      }
    }

    const target = {
      cx: (x0 + x1) / 2,
      cy: (y0 + y1) / 2 - (openPlayer || openSection ? 0 : this.H * 0.08),
      w: x1 - x0,
      h: y1 - y0
    };

    if (!wide && !openPlayer && !openSection) {
      target.h = this.H * 0.7;
      target.cy = this.H * 0.475;
      target.cx = this.W * 0.47;
    }

    const k = this.fr.ready ? 1 - Math.exp(-dt * 5) : 1;
    this.fr.cx += (target.cx - this.fr.cx) * k;
    this.fr.cy += (target.cy - this.fr.cy) * k;
    this.fr.w += (target.w - this.fr.w) * k;
    this.fr.h += (target.h - this.fr.h) * k;
    this.fr.ready = true;

    const fitH = 2 * Math.atan(100 / 1.03 / 2 / 160.0 * (this.H / this.fr.h)) * 180 / Math.PI;
    const fitW = 2 * Math.atan((100 * 0.93418) / 0.96 / 2 / 160.0 / this.camera.aspect * (this.W / this.fr.w)) * 180 / Math.PI;
    this.camera.fov = wide || openPlayer || openSection ? Math.max(fitH, fitW) : fitH;

    this.camera.setViewOffset(this.W, this.H, this.W / 2 - this.fr.cx, this.H / 2 - this.fr.cy, this.W, this.H);
    this.camera.updateProjectionMatrix();
  }

  private handleResize() {
    if (!this.canvas) return;
    const cr = this.canvas.getBoundingClientRect();
    this.W = Math.round(cr.width) || window.innerWidth;
    this.H = Math.round(cr.height) || window.innerHeight;

    const gl = this.renderer.getContext();
    const vp = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    const mx = Math.min(vp[0], vp[1], gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
    this.renderer.setPixelRatio(Math.max(0.5, Math.min(this.dpr, mx / this.W, mx / this.H, Math.sqrt(PXB / (this.W * this.H)))));
    this.renderer.setSize(this.W, this.H, false);
    this.camera.aspect = this.W / this.H;
    this.stage(1.0);
  }

  private pushDelta(dy: number) {
    if (this.rewind) {
      this.rewind = null;
      this.targetDist = this.dist;
    }
    this.targetDist = Math.max(0, this.targetDist + dy);
  }

  private isEventInsideModal(e: Event): boolean {
    const path = e.composedPath ? e.composedPath() : [];
    for (const el of path) {
      if (el instanceof HTMLElement) {
        if (
          el.classList.contains('vault-drawer-card') ||
          el.classList.contains('vault-drawer-overlay') ||
          el.classList.contains('vault-drawer-body') ||
          el.classList.contains('vault-scrollable') ||
          el.classList.contains('vault-player-panel') ||
          el.getAttribute('role') === 'dialog' ||
          el.tagName === 'ASIDE'
        ) {
          return true;
        }
      }
    }
    const target = e.target as HTMLElement | null;
    return !!target?.closest?.('.vault-drawer-card, .vault-drawer-overlay, .vault-drawer-body, .vault-scrollable, .vault-player-panel, [role="dialog"], aside');
  }

  private isModalOpen(): boolean {
    const dialog = document.querySelector('.vault-drawer-card:not(.opacity-0), [role="dialog"]:not(.opacity-0)');
    if (dialog) return true;
    const player = document.querySelector('.vault-player-panel:not(.translate-x-full)');
    if (player) return true;
    return false;
  }

  private handleWheel(e: WheelEvent) {
    if (this.isEventInsideModal(e)) {
      return;
    }
    if (this.isModalOpen()) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const mult = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? this.H : 1;
    this.pushDelta(e.deltaY * mult * 0.22);
  }

  private handlePointerDown(e: PointerEvent) {
    if (this.isEventInsideModal(e) || this.isModalOpen()) {
      return;
    }
    this.isInteracting = true;
    this.pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    this.pointerCurrentPos = { x: e.clientX, y: e.clientY, inCanvas: e.target === this.canvas };
    this.velocity = 0;
  }

  private handlePointerMove(e: PointerEvent) {
    this.pointerCurrentPos = { x: e.clientX, y: e.clientY, inCanvas: e.target === this.canvas };
    this.mouseNorm.x = (e.clientX / this.W) * 2 - 1;
    this.mouseNorm.y = -(e.clientY / this.H) * 2 + 1;

    if (this.isInteracting) {
      const now = performance.now();
      const dy = (this.pointerDownPos.y - e.clientY) * 0.85;
      this.pushDelta(dy);
      const dt = Math.max(8, now - this.pointerDownPos.time);
      this.velocity = (dy / dt) * 16;
      this.pointerDownPos.y = e.clientY;
      this.pointerDownPos.time = now;
    }
  }

  private handlePointerUp(e: PointerEvent) {
    this.isInteracting = false;
    const dx = Math.abs(e.clientX - this.pointerDownPos.x);
    const dy = Math.abs(e.clientY - this.pointerDownPos.y);
    const dt = performance.now() - this.pointerDownPos.time;

    if (dx < 10 && dy < 10 && dt < 600 && e.target === this.canvas) {
      if (this.dist < 30) return;

      const pickedIdx = this.pickInstance(e.clientX, e.clientY);
      const targetIdx = pickedIdx >= 0 ? pickedIdx : this.hoveredIndex;

      if (targetIdx >= this.N && targetIdx < this.N + RUNWAY.n && this.data) {
        const w = this.world[targetIdx];
        const itemIdx = this.tileItem[targetIdx];
        if (itemIdx >= 0) {
          const item = this.data.entries[itemIdx];
          if (item) {
            const itemZ = -w.pos.z;
            const focusDist = Math.max(0, itemZ - 42);
            const distDiff = Math.abs(this.dist - focusDist);

            if (distDiff > 25) {
              this.flyTo(focusDist);
            } else {
              this.onSelectCallback(item);
            }
          }
        }
      }
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (document.activeElement && document.activeElement.tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
    const steps: Record<string, number> = {
      ArrowDown: 160,
      PageDown: 600,
      ' ': 600,
      ArrowUp: -160,
      PageUp: -600
    };
    if (steps[e.key]) {
      e.preventDefault();
      this.pushDelta(steps[e.key]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.rewindToStart();
    }
  }

  public rewindToStart() {
    if (this.dist < 1) return;
    this.rewind = {
      from: this.dist,
      t0: performance.now(),
      dur: Math.min(2400, 1200 + Math.sqrt(this.dist) * 14)
    };
    this.velocity = 0;
  }

  private pickInstance(clientX: number, clientY: number): number {
    if (this.dist < 30 || !this.data || !this.mesh || this.world.length === 0 || this.W === 0 || this.H === 0) return -1;
    
    const focal = this.H / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    const cx = this.W / 2;
    const cy = this.H / 2;
    const D = this.data;
    const aspect = D.cell[0] / D.cell[1];

    let bestIdx = -1;
    let closestZ = -9999999;

    const start = this.N;
    const end = Math.min(this.totalCapacity, this.N + RUNWAY.n);

    for (let i = start; i < end; i++) {
      const w = this.world[i];
      if (w.h <= 0.1) continue;

      const zRel = -w.pos.z + this.camera.position.z;
      if (zRel <= w.h * 1.5 || zRel > 2500.0) continue;

      const pxScale = focal / zRel;
      const sx = cx + (w.pos.x - this.camera.position.x) * pxScale;
      const sy = cy - (w.pos.y - this.camera.position.y) * pxScale;
      const sh = w.h * pxScale;
      const sw = sh * aspect;

      const halfW = Math.max(sw * 0.5, 6.0);
      const halfH = Math.max(sh * 0.5, 6.0);

      if (
        clientX >= sx - halfW &&
        clientX <= sx + halfW &&
        clientY >= sy - halfH &&
        clientY <= sy + halfH
      ) {
        if (w.pos.z > closestZ) {
          closestZ = w.pos.z;
          bestIdx = i;
        }
      }
    }

    return bestIdx;
  }

  private updateHover() {
    if (this.dist < 30 || !this.pointerCurrentPos.inCanvas) {
      if (this.hoveredIndex !== -1) {
        this.hoveredIndex = -1;
        this.uniforms.uHover.value = -1;
        this.canvas.style.cursor = 'default';
        this.onHoverCallback(null);
      }
      return;
    }

    const idx = this.pickInstance(this.pointerCurrentPos.x, this.pointerCurrentPos.y);

    if (idx !== this.hoveredIndex) {
      this.hoveredIndex = idx;
      this.uniforms.uHover.value = idx;
      if (idx >= this.N && idx < this.N + RUNWAY.n && this.data) {
        this.canvas.style.cursor = 'pointer';
        const itemIdx = this.tileItem[idx];
        const item = itemIdx >= 0 ? this.data.entries[itemIdx] : null;
        this.onHoverCallback(item, { x: this.pointerCurrentPos.x, y: this.pointerCurrentPos.y });
      } else {
        this.canvas.style.cursor = 'default';
        this.onHoverCallback(null);
      }
    }
  }

  public setFilter(playlist: string | null) {
    this.activeFilter = playlist;
    if (!this.mesh || !this.data) return;

    for (let i = 0; i < this.totalCapacity; i++) {
      const itemIdx = this.tileItem[i];
      if (itemIdx >= 0 && itemIdx < this.data.entries.length) {
        const item = this.data.entries[itemIdx];
        const match = !playlist || item.playlist === playlist;
        this.attrFilterDim.setX(i, match ? 1.0 : 0.12);
      } else {
        this.attrFilterDim.setX(i, 1.0);
      }
    }
    this.attrFilterDim.needsUpdate = true;
  }

  public setSoft(soft: boolean) {
    this.targetSoft = soft ? 1 : 0;
    this.isDrawerOpen = soft;
  }

  public setSectionModalOpen(open: boolean) {
    this.isSectionModalOpen = open;
    this.targetSoft = open || this.isDrawerOpen ? 1 : 0;
  }

  public flyTo(target: number) {
    if (this.rewind) this.rewind = null;
    this.targetDist = Math.max(0, target);
  }

  public startIntro() {
    if (this.introStart < 0 && !this.introDone) {
      this.introStart = performance.now();
      this.introEnd = 0;
    }
  }

  private updateIntro(now: number) {
    if (this.introStart < 0 || !this.data || !this.mesh) return;
    const t = now - this.introStart;
    if (this.introEnd > 0 && t > this.introEnd) {
      this.introStart = -1;
      this.introDone = true;
      this.updateHaloFloaters(now);
      return;
    }

    const D = this.data;
    const v = this.vIntroPos;
    const tg = this.vIntroTg;
    let last = 0;

    for (let i = 0; i < this.N; i++) {
      if (this.tileEpoch[i] !== 0) continue;
      const w = this.world[i];
      const c = D.cells[i];
      if (c[9] === 1 || w.h0 <= 0) continue;

      if (!w.from) {
        const r = rng(i + 101, 7);
        const k = c[4] / D.D0;
        const a = r() * Math.PI * 2;
        const rad = (60 + r() * 120) * k;
        w.from = new THREE.Vector3(Math.cos(a) * rad, Math.sin(a) * rad, -(c[4] * (1.4 + r() * 1.2)));
        w.delay = r() * 1500 + Math.hypot(c[5] - D.cols / 2, c[6] - D.rows * 0.4) * 9;
        w.dur = 1300 + r() * 900;
      }

      last = Math.max(last, w.delay + w.dur);
      let p = Math.min(1, Math.max(0, (t - w.delay) / w.dur));
      p = 1 - Math.pow(1 - p, 3);

      const dim = c[8] ?? 1;
      tg.copy(w.pos);

      v.lerpVectors(w.from, tg, p);
      this.attrDim.setX(i, dim * Math.min(1, p * 1.6));
      const s = w.h * (0.35 + 0.65 * p);
      this.vS.set(s, s, 1);
      this.mesh.setMatrixAt(i, this.m4.compose(v, this.qI, this.vS));
    }

    this.introEnd = last + 50;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.attrDim.needsUpdate = true;
  }

  private updateHaloFloaters(now: number) {
    if (!this.mesh || this.dist > 300) return;
    const t = now * 0.001;

    for (let j = 0; j < this.floaters.length; j += 2) {
      const i = this.floaters[j];
      const w = this.world[i];
      if (!w.float) continue;

      const f = w.float;
      const u = (t * f[0] + f[2]) % 1;
      const out = Math.pow(1 - u, 1.6);
      const sw = flow(w.base.x * 0.01, w.base.y * 0.01, t + f[3]);
      const r0 = f[4];

      w.pos.x = w.base.x + sw[0] * out * r0;
      w.pos.y = w.base.y + sw[1] * out * r0;

      const dim = Math.min(1, u / 0.3) * (1 - Math.max(0, (u - 0.8) / 0.2) * 0.85);
      this.attrDim.setX(i, dim);

      this.vS.set(w.h, w.h, 1);
      this.mesh.setMatrixAt(i, this.m4.compose(w.pos, this.qI, this.vS));
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.attrDim.needsUpdate = true;
  }

  private setGrow(g: number) {
    if (Math.abs(g - this.grow) < 0.002 || !this.mesh || !this.data) return;
    this.grow = g;
    const D = this.data;
    for (let i = 0; i < this.N; i++) {
      if (this.tileEpoch[i] !== 0 || D.cells[i][9]) continue;
      const w = this.world[i];
      w.h = w.h0 * (w.hs + (1.0 - w.hs) * this.grow);
      if (!w.float) {
        this.vS.set(w.h, w.h, 1);
        this.mesh.setMatrixAt(i, this.m4.compose(w.pos, this.qI, this.vS));
      }
    }
    this.dirty = true;
  }

  private renderLoop(time: number) {
    if (this.isDestroyed) return;

    const dt = Math.min(0.05, (time - this.lastTime) * 0.001 || 0.016);
    this.lastTime = time;

    this.drainSliceJobs();

    if (this.rewind) {
      const elapsed = (time - this.rewind.t0) / this.rewind.dur;
      if (elapsed >= 1) {
        this.dist = 0;
        this.targetDist = 0;
        this.rewind = null;
      } else {
        const ease = elapsed < 0.5 ? 4 * elapsed * elapsed * elapsed : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
        this.dist = this.rewind.from * (1 - ease);
        this.targetDist = this.dist;
      }
    } else {
      if (Math.abs(this.velocity) > 0.1) {
        this.pushDelta(this.velocity);
        this.velocity *= Math.exp(-dt * 4.2);
      }
      this.dist += (this.targetDist - this.dist) * (1 - Math.exp(-dt * 2.8));
      if (Math.abs(this.targetDist - this.dist) < 0.01) {
        this.dist = this.targetDist;
      }
    }

    let activeItem: ArchiveItem | null = null;
    if (this.data && this.dist >= 30) {
      const rIdx = this.runwayIndexAt(this.dist);
      const seqIdx = this.data.seq[rIdx % this.data.seq.length];
      activeItem = this.data.entries[seqIdx % this.data.entries.length] || null;
    }
    this.onDistChangeCallback?.(this.dist, activeItem);

    this.drift.x += (this.mouseNorm.x - this.drift.x) * (1 - Math.exp(-dt * 1.5));
    this.drift.y += (this.mouseNorm.y - this.drift.y) * (1 - Math.exp(-dt * 1.5));

    const away = Math.min(1, this.dist / 120);
    const ease = away * away * (3 - 2 * away);
    this.uniforms.uShift.value = 1.0 * (1 - ease);
    this.uniforms.uFog.value = ease;
    this.uniforms.uBlur.value = ease;

    const drift = 0.5 + ease * 2.5;
    this.camera.position.set(this.drift.x * drift, -this.drift.y * drift, -this.dist);
    this.camera.lookAt(this.drift.x * drift * 0.6, -this.drift.y * drift * 0.6, -this.dist - 200);

    this.stage(dt);

    this.softFactor += (this.targetSoft - this.softFactor) * (1 - Math.exp(-dt * 6));
    this.uniforms.uSoft.value = this.softFactor;
    this.uniforms.uTime.value = time * 0.001;

    this.setGrow(ease);
    this.cycleEpochs();
    this.updateRunway();
    if (this.introStart >= 0) {
      this.updateIntro(time);
    } else {
      this.updateHaloFloaters(time);
    }
    this.flush();
    this.updateHover();
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.renderLoop);
  }

  private attachEvents() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.renderer.dispose();
  }
}
