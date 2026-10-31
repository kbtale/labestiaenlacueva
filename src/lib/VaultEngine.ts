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
  step: 55,
  h: 7.5,
  x: 12,
  y: 7,
  z0: 270,
  n: 52,
  rx: 30,
  ry: 22
};

const VORTEX_RADIUS = 150.0;
const CYCLE_PERIOD = 1384.0;

export class VaultEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private field: THREE.Group;
  private data: ArchiveDataset | null = null;
  private mesh: THREE.InstancedMesh | null = null;
  private onHoverCallback: (item: ArchiveItem | null) => void;
  private onSelectCallback: (item: ArchiveItem) => void;
  private onDistChangeCallback?: (dist: number) => void;
  private onProgressCallback?: (progress: number) => void;
  
  private W = 0;
  private H = 0;
  private dpr = 1;
  private dist = 0;
  private targetDist = 0;
  private isInteracting = false;
  private pointerDownPos = { x: 0, y: 0, time: 0 };
  private pointerCurrentPos = { x: -1000, y: -1000, inCanvas: false };
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
  private stride = 2;
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

  private m4 = new THREE.Matrix4();
  private qI = new THREE.Quaternion();
  private vS = new THREE.Vector3();

  private world: Array<{
    pos: THREE.Vector3;
    base: THREE.Vector3;
    h: number;
    h0: number;
    hs: number;
    hideFly: boolean;
    float?: [number, number, number, number, number];
  }> = [];

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
    onHover: (item: ArchiveItem | null) => void,
    onSelect: (item: ArchiveItem) => void,
    onDistChange?: (dist: number) => void,
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
    const isSmall = Math.min(window.innerWidth, window.innerHeight) * this.dpr < 1200;
    const src = isSmall ? '/atlas/archive-0-sm.webp' : '/atlas/archive-0.webp';
    const loader = new THREE.TextureLoader();
    const tex = await loader.loadAsync(src);
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    this.uniforms.uMap.value = tex;
  }

  private buildMesh() {
    if (!this.data) return;
    const D = this.data;
    this.N = D.cells.length;
    this.totalCapacity = this.N + RUNWAY.n;
    this.stride = Math.max(1, Math.ceil(this.N / (D.entries.length * 0.8)));

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
      
      void main() {
        vec4 mv = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
        float s = length(instanceMatrix[1].xyz);
        float d = -mv.z;
        vFade = smoothstep(s * 1.1, s * 2.6, d);
        vDepth = d;
        vLocal = uv;
        vBias = uBlur * pow(smoothstep(45.0, 1150.0, d), 0.75) * 5.0 + uSoft * 0.6;
        vec2 pad = 0.5 * exp2(vBias) / uTilePx + 0.002;
        vec2 inset = mix(pad, 1.0 - pad, uv);
        vUv = vec2((aSlot.x + inset.x) / uGrid.x, 1.0 - (aSlot.y + 1.0 - inset.y) / uGrid.y);
        vColor = aColor;
        vMean = aMean;
        vDim = aDim;
        vFill = aFill;
        vFilterDim = aFilterDim;
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
        c = mix(c, uBg, smoothstep(520.0, 1500.0, vDepth) * uFog);
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

    this.attrSlot.setUsage(THREE.DynamicDrawUsage);
    this.attrColor.setUsage(THREE.DynamicDrawUsage);
    this.attrMean.setUsage(THREE.DynamicDrawUsage);
    this.attrDim.setUsage(THREE.DynamicDrawUsage);
    this.attrFill.setUsage(THREE.DynamicDrawUsage);
    this.attrFilterDim.setUsage(THREE.DynamicDrawUsage);

    geo.setAttribute('aSlot', this.attrSlot);
    geo.setAttribute('aColor', this.attrColor);
    geo.setAttribute('aMean', this.attrMean);
    geo.setAttribute('aDim', this.attrDim);
    geo.setAttribute('aFill', this.attrFill);
    geo.setAttribute('aFilterDim', this.attrFilterDim);

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

      const isHalo = c[9] === 1 || (c[8] ?? 1) < 0.6;
      if (isHalo) {
        const seed = (i * 137.5) % 1;
        w.float = [0.04 + seed * 0.05, 0, seed, i * 0.35, 18 + seed * 25];
        this.floaters.push(i);
      }

      this.world[i] = w;
      this.attrColor.setXYZ(i, c[1] / 255, c[2] / 255, c[3] / 255);
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
      w.pos.set(
        (col + 0.5 - D.cols / 2) * D.cell[0] * k,
        (D.rows / 2 - row - 0.5) * D.cell[1] * k,
        -d
      );
      w.base.copy(w.pos);
      w.hideFly = !!c[9] || (Math.abs(w.pos.x) < RUNWAY.rx && Math.abs(w.pos.y) < RUNWAY.ry);
      this.attrDim.setX(i, c[8] ?? 1);
      this.attrFill.setX(i, w.hideFly ? 1 : 0);
    } else if (i % this.stride !== 0) {
      w.h = 0;
      w.hideFly = false;
    } else {
      const r = rng(i + 1, epoch);
      const ang = r() * Math.PI * 2;
      const rad = RUNWAY.rx + (VORTEX_RADIUS - RUNWAY.rx) * Math.pow(r(), 0.8);
      w.h = 1.4 + Math.pow(r(), 2.2) * 7;
      w.pos.set(
        Math.cos(ang) * rad,
        Math.sin(ang) * rad * 0.8,
        -(d + epoch * CYCLE_PERIOD)
      );
      w.hideFly = false;
      this.attrDim.setX(i, 1);
      this.attrFill.setX(i, 0);
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
    this.dirty = false;
  }

  private handleResize() {
    if (!this.canvas) return;
    const cr = this.canvas.getBoundingClientRect();
    this.W = Math.round(cr.width) || window.innerWidth;
    this.H = Math.round(cr.height) || window.innerHeight;
    this.renderer.setSize(this.W, this.H, false);
    this.camera.aspect = this.W / this.H;

    const wide = this.W > 860;
    const fitH = 2 * Math.atan(100 / 1.03 / 2 / 160.0) * 180 / Math.PI;
    const fitW = 2 * Math.atan((100 * 0.93418) / 0.96 / 2 / 160.0 / this.camera.aspect) * 180 / Math.PI;
    this.camera.fov = wide ? Math.max(fitH, fitW) : fitH;

    if (!wide) {
      this.camera.setViewOffset(this.W, this.H, 0, -this.H * 0.08, this.W, this.H);
    } else {
      this.camera.clearViewOffset();
    }
    this.camera.updateProjectionMatrix();
  }

  private handleWheel(e: WheelEvent) {
    this.targetDist += e.deltaY * 0.85;
    this.targetDist = Math.max(0, this.targetDist);
  }

  private handlePointerDown(e: PointerEvent) {
    this.isInteracting = true;
    this.pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    this.pointerCurrentPos = { x: e.clientX, y: e.clientY, inCanvas: e.target === this.canvas };
  }

  private handlePointerMove(e: PointerEvent) {
    this.pointerCurrentPos = { x: e.clientX, y: e.clientY, inCanvas: e.target === this.canvas };

    if (this.isInteracting) {
      const dy = e.clientY - this.pointerDownPos.y;
      this.pointerDownPos.y = e.clientY;
      this.targetDist -= dy * 2.2;
      this.targetDist = Math.max(0, this.targetDist);
    }
  }

  private handlePointerUp(e: PointerEvent) {
    this.isInteracting = false;
    const dx = Math.abs(e.clientX - this.pointerDownPos.x);
    const dy = Math.abs(e.clientY - this.pointerDownPos.y);
    const dt = performance.now() - this.pointerDownPos.time;

    if (dx < 10 && dy < 10 && dt < 600 && e.target === this.canvas) {
      const pickedIdx = this.pickInstance(e.clientX, e.clientY);
      const targetIdx = pickedIdx >= 0 ? pickedIdx : this.hoveredIndex;
      if (targetIdx >= 0 && this.data) {
        const itemIdx = this.tileItem[targetIdx];
        if (itemIdx >= 0) {
          const item = this.data.entries[itemIdx];
          if (item) this.onSelectCallback(item);
        }
      }
    }
  }

  private pickInstance(clientX: number, clientY: number): number {
    if (!this.data || this.world.length === 0 || this.W === 0 || this.H === 0) return -1;
    
    const focal = this.H / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    const cx = this.W / 2;
    const cy = this.H / 2;
    const D = this.data;
    const aspect = D.cell[0] / D.cell[1];

    let bestIdx = -1;
    let closestZ = -9999999;

    const checkLimit = Math.min(this.totalCapacity, this.world.length);
    for (let i = 0; i < checkLimit; i++) {
      const w = this.world[i];
      if (!w || w.h <= 0.01) continue;
      if (this.grow > 0.3 && w.hideFly) continue;

      const zRel = -w.pos.z - this.camera.position.z;
      if (zRel <= w.h * 1.5 || zRel > 2500.0) continue;

      const pxScale = focal / zRel;
      const sx = cx + w.pos.x * pxScale;
      const sy = cy - w.pos.y * pxScale;
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
    if (!this.pointerCurrentPos.inCanvas) {
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
      if (idx >= 0 && this.data) {
        this.canvas.style.cursor = 'pointer';
        const itemIdx = this.tileItem[idx];
        const item = itemIdx >= 0 ? this.data.entries[itemIdx] : null;
        this.onHoverCallback(item);
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
  }

  public flyTo(target: number) {
    this.targetDist = Math.max(0, target);
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

  private renderLoop(time: number) {
    if (this.isDestroyed) return;

    this.dist += (this.targetDist - this.dist) * 0.08;
    this.onDistChangeCallback?.(this.dist);

    this.softFactor += (this.targetSoft - this.softFactor) * 0.1;
    this.uniforms.uSoft.value = this.softFactor;
    this.uniforms.uTime.value = time * 0.001;

    this.grow = Math.min(1.0, this.dist / 300.0);
    this.uniforms.uShift.value = this.grow;
    this.uniforms.uFog.value = Math.min(1.0, this.dist / 800.0);

    this.camera.position.z = this.dist;

    this.cycleEpochs();
    this.updateRunway();

    if (this.mesh && Math.abs(this.targetDist - this.dist) > 0.05) {
      for (let i = 0; i < this.N; i += 7) {
        const w = this.world[i];
        if (this.tileEpoch[i] === 0 && !w.hideFly) {
          const currentH = w.h0 * (w.hs + (1.0 - w.hs) * this.grow);
          this.vS.set(currentH, currentH, 1);
          this.mesh.setMatrixAt(i, this.m4.compose(w.pos, this.qI, this.vS));
        }
      }
      this.mesh.instanceMatrix.needsUpdate = true;
    }

    this.updateHaloFloaters(time);
    this.flush();
    this.updateHover();
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.renderLoop);
  }

  private attachEvents() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('wheel', this.handleWheel, { passive: true });
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.renderer.dispose();
  }
}
