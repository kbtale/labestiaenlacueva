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
  
  private world: Array<{
    pos: THREE.Vector3;
    base: THREE.Vector3;
    h: number;
    h0: number;
    hs: number;
    itemIndex: number;
    isSubject: boolean;
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
    onSelect: (item: ArchiveItem) => void
  ) {
    this.canvas = canvas;
    this.onHoverCallback = onHover;
    this.onSelectCallback = onSelect;
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
      const resp = await fetch('/data/archive.json');
      this.data = (await resp.json()) as ArchiveDataset;
      await this.loadAtlasTexture();
      this.buildMesh();
      this.handleResize();
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
    const cellCount = D.cells.length;
    const geo = new THREE.PlaneGeometry(D.cell[0] / D.cell[1], 1);

    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -1000), 10000);

    const vertShader = `
      attribute vec2 aSlot;
      attribute vec3 aColor;
      attribute vec3 aMean;
      attribute float aDim;
      attribute float aFilterDim;
      
      uniform vec2 uGrid;
      uniform float uHover;
      uniform float uBlur;
      uniform vec2 uTilePx;
      uniform float uSoft;
      
      varying vec2 vUv;
      varying vec2 vLocal;
      varying vec3 vColor;
      varying vec3 vMean;
      varying float vFade;
      varying float vDepth;
      varying float vHover;
      varying float vDim;
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
      varying float vFilterDim;
      varying float vBias;
      
      float ign(vec2 p) {
        return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
      }
      
      void main() {
        float a = vFade;
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

    this.mesh = new THREE.InstancedMesh(geo, mat, cellCount);
    this.mesh.frustumCulled = false;

    const aSlot = new Float32Array(cellCount * 2);
    const aColor = new Float32Array(cellCount * 3);
    const aMean = new Float32Array(cellCount * 3);
    const aDim = new Float32Array(cellCount);
    const aFilterDim = new Float32Array(cellCount);

    const m4 = new THREE.Matrix4();
    const qI = new THREE.Quaternion();
    const vS = new THREE.Vector3();

    this.world = [];
    const entries = D.entries;
    const entryCount = entries.length;

    for (let i = 0; i < cellCount; i++) {
      const c = D.cells[i];
      const entryIdx = c[0] % entryCount;
      const entry = entries[entryIdx];
      const slot = entry.slot;
      const col = slot % 16;
      const row = Math.floor(slot / 16);

      aSlot[i * 2] = col;
      aSlot[i * 2 + 1] = row;
      aColor[i * 3] = c[1] / 255;
      aColor[i * 3 + 1] = c[2] / 255;
      aColor[i * 3 + 2] = c[3] / 255;
      aMean[i * 3] = entry.mean[0] / 255;
      aMean[i * 3 + 1] = entry.mean[1] / 255;
      aMean[i * 3 + 2] = entry.mean[2] / 255;
      aDim[i] = c[8] ?? 1;
      aFilterDim[i] = 1.0;

      const d = c[4];
      const k = d / D.D0;
      const h0 = D.cell[1] * k * 0.94;
      const hs = c[7] ?? 1;
      const h = h0 * hs;
      const cCol = c[5];
      const cRow = c[6];
      const pos = new THREE.Vector3(
        (cCol + 0.5 - D.cols / 2) * D.cell[0] * k,
        (D.rows / 2 - cRow - 0.5) * D.cell[1] * k,
        -d
      );

      this.world.push({
        pos: pos.clone(),
        base: pos.clone(),
        h,
        h0,
        hs,
        itemIndex: entryIdx,
        isSubject: c[9] === 0
      });

      vS.set(h, h, 1);
      m4.compose(pos, qI, vS);
      this.mesh.setMatrixAt(i, m4);
    }

    geo.setAttribute('aSlot', new THREE.InstancedBufferAttribute(aSlot, 2));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
    geo.setAttribute('aMean', new THREE.InstancedBufferAttribute(aMean, 3));
    geo.setAttribute('aDim', new THREE.InstancedBufferAttribute(aDim, 1));
    geo.setAttribute('aFilterDim', new THREE.InstancedBufferAttribute(aFilterDim, 1));

    this.mesh.instanceMatrix.needsUpdate = true;
    this.field.add(this.mesh);
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
    this.targetDist = Math.max(0, Math.min(2200, this.targetDist));
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
      this.targetDist = Math.max(0, Math.min(2200, this.targetDist));
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
        const w = this.world[targetIdx];
        if (w) {
          const item = this.data.entries[w.itemIndex];
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
    let closestZ = -999999;

    const len = this.world.length;
    for (let i = 0; i < len; i += 2) {
      const w = this.world[i];
      const zRel = -w.pos.z - this.camera.position.z;
      if (zRel <= 10.0 || zRel > 2500.0) continue;

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
        const w = this.world[idx];
        const item = w ? this.data.entries[w.itemIndex] : null;
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
    const attr = this.mesh.geometry.getAttribute('aFilterDim') as THREE.InstancedBufferAttribute;
    if (!attr) return;

    for (let i = 0; i < this.world.length; i++) {
      const w = this.world[i];
      const item = this.data.entries[w.itemIndex];
      const match = !playlist || item.playlist === playlist;
      attr.setX(i, match ? 1.0 : 0.12);
    }
    attr.needsUpdate = true;
  }

  public setSoft(soft: boolean) {
    this.targetSoft = soft ? 1 : 0;
  }

  private renderLoop(time: number) {
    if (this.isDestroyed) return;

    this.dist += (this.targetDist - this.dist) * 0.08;
    this.softFactor += (this.targetSoft - this.softFactor) * 0.1;
    this.uniforms.uSoft.value = this.softFactor;
    this.uniforms.uTime.value = time * 0.001;

    const grow = Math.min(1.0, this.dist / 300.0);
    this.uniforms.uShift.value = grow;
    this.uniforms.uFog.value = Math.min(1.0, this.dist / 800.0);

    this.camera.position.z = this.dist;

    if (this.mesh && Math.abs(this.targetDist - this.dist) > 0.05) {
      const m4 = new THREE.Matrix4();
      const qI = new THREE.Quaternion();
      const vS = new THREE.Vector3();

      for (let i = 0; i < this.world.length; i += 7) {
        const w = this.world[i];
        if (w.isSubject) {
          const currentH = w.h0 * (w.hs + (1.0 - w.hs) * grow);
          vS.set(currentH, currentH, 1);
          m4.compose(w.pos, qI, vS);
          this.mesh.setMatrixAt(i, m4);
        }
      }
      this.mesh.instanceMatrix.needsUpdate = true;
    }

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
