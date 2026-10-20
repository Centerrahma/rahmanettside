/** Decorative arch only. Payment panels and QR codes never enter this renderer. */
export interface LightArch {
  setPaused(paused: boolean): void;
  destroy(): void;
}

const vertexSource = `precision highp float;
attribute vec3 a_target;
attribute vec3 a_seed;
uniform float u_time, u_aspect, u_dpr, u_static;
uniform vec2 u_pointer;
varying float v_alpha, v_tone;
void main() {
  float t=u_time;
  float e=1.0-pow(1.0-clamp(t/3.2,0.0,1.0),4.0);
  if(u_static>.5) e=1.0;
  vec3 q=a_target;
  float wave=sin(q.y*4.0+t*.48+q.z*7.0);
  q.x+=wave*.012;
  q.z+=sin(t*.15+q.y*2.0)*.06;
  float a=sin(t*.08)*.05+u_pointer.x*.08;
  q.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*q.xz;
  vec3 from=vec3((a_seed.x-.5)*7.0,(a_seed.y-.5)*5.0,1.7+a_seed.z);
  q=mix(from,q,e);
  float persp=3.2/(3.2+q.z);
  gl_Position=vec4((q.x+u_pointer.x*.03)*persp/u_aspect,q.y*persp,0.0,1.0);
  gl_PointSize=(1.8+a_seed.z*3.0)*u_dpr*persp;
  v_alpha=(.18+a_seed.x*.26)*(.6+.4*pow(.5+.5*wave,4.0));
  v_tone=a_seed.y;
}`;

const fragmentSource = `precision highp float;
uniform vec2 u_resolution;
uniform float u_dpr;
uniform vec4 u_rects[3];
varying float v_alpha, v_tone;
void main() {
  vec2 uv=gl_PointCoord-.5;
  float r=dot(uv,uv);
  if(r>.25) discard;
  float soft=exp(-r*18.0);
  vec2 xy=vec2(gl_FragCoord.x/u_dpr,u_resolution.y-gl_FragCoord.y/u_dpr);
  float mask=1.0;
  for(int i=0;i<3;i++) {
    vec4 b=u_rects[i];
    vec2 d=max(max(b.xy-xy,xy-b.zw),vec2(0.0));
    mask=min(mask,.035+.965*clamp(length(d)/30.0,0.0,1.0));
  }
  vec3 c=mix(vec3(.97,.94,.83),vec3(.95,.78,.42),v_tone*.8);
  gl_FragColor=vec4(c,v_alpha*soft*mask);
}`;

const pointCount = 23000;
function seed(value: number) {
  const valueInRange = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return valueInRange - Math.floor(valueInRange);
}

export function createLightArch(canvas: HTMLCanvasElement, hero: HTMLElement): LightArch {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  const fallback: LightArch = { setPaused() {}, destroy() {} };
  if (!gl) return fallback;

  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const program = gl.createProgram();
  if (!program) return fallback;
  function release() {
    buffers.forEach(buffer => gl!.deleteBuffer(buffer));
    shaders.forEach(shader => gl!.deleteShader(shader));
    gl!.deleteProgram(program);
    delete canvas.dataset.renderer;
  }
  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
  }
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) { release(); return fallback; }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { release(); return fallback; }
  gl.useProgram(program);

  const positions: number[] = [];
  const random: number[] = [];
  for (let i = 0; i < pointCount; i++) {
    const spread = seed(i), distance = seed(i + 60000), side = i % 2 ? 1 : -1;
    const depth = seed(i + 90000), progress = Math.min(distance / .6, 1);
    const x = side * (1.9 + depth * .32) * (1 - (1 - progress) ** 2);
    const y = distance <= .6 ? 1.05 - 1.55 * (.55 * progress + .45 * progress ** 2) : -.5 - (distance - .6) / .4 * .8;
    positions.push(x + (spread - .5) * .02, y, (depth - .5) * .42);
    random.push(spread, seed(i + 120000), depth);
  }
  function attribute(name: string, values: number[]) {
    const buffer = gl!.createBuffer();
    if (!buffer) return false;
    buffers.push(buffer);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(values), gl!.STATIC_DRAW);
    const location = gl!.getAttribLocation(program!, name);
    if (location < 0) return false;
    gl!.enableVertexAttribArray(location);
    gl!.vertexAttribPointer(location, 3, gl!.FLOAT, false, 0, 0);
    return true;
  }
  if (!attribute('a_target', positions) || !attribute('a_seed', random)) { release(); return fallback; }
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = { time: uniform('u_time'), aspect: uniform('u_aspect'), dpr: uniform('u_dpr'), resolution: uniform('u_resolution'), pointer: uniform('u_pointer'), fixed: uniform('u_static'), masks: uniform('u_rects[0]') };
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.disable(gl.DEPTH_TEST);

  let width = 1, height = 1, dpr = 1, frame = 0, lastFrame = 0, elapsed = 0;
  let paused = true, onScreen = true, destroyed = false, contextLost = false;
  const target = { x: 0, y: 0 }, spring = { x: 0, y: 0 };
  const masks = new Float32Array(12);
  const canAnimate = () => !destroyed && !contextLost && !paused && onScreen && !document.hidden;

  function draw(staticFrame = false) {
    if (destroyed || contextLost) return;
    gl!.useProgram(program);
    gl!.uniform1f(uniforms.time, staticFrame ? 4 : elapsed / 1000);
    gl!.uniform1f(uniforms.aspect, width / height);
    gl!.uniform1f(uniforms.dpr, dpr);
    gl!.uniform2f(uniforms.resolution, width, height);
    gl!.uniform2f(uniforms.pointer, spring.x, spring.y);
    gl!.uniform1f(uniforms.fixed, staticFrame ? 1 : 0);
    gl!.uniform4fv(uniforms.masks, masks);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.POINTS, 0, pointCount);
  }
  function tick(now: number) {
    frame = 0;
    if (!canAnimate()) return;
    if (!lastFrame || now - lastFrame >= 32) {
      elapsed += lastFrame ? Math.min(now - lastFrame, 100) : 0;
      lastFrame = now;
      spring.x += (target.x - spring.x) * .055;
      spring.y += (target.y - spring.y) * .055;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function syncLoop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(bounds.width, 1); height = Math.max(bounds.height, 1);
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    masks.fill(0);
    [...hero.querySelectorAll('[data-light-mask]')].slice(0, 3).forEach((element, index) => {
      const box = element.getBoundingClientRect();
      masks.set([box.left - bounds.left - 5, box.top - bounds.top - 5, box.right - bounds.left + 5, box.bottom - bounds.top + 5], index * 4);
    });
    draw(paused);
  }
  const onPointer = (event: PointerEvent) => {
    if (!canAnimate() || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    target.x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
    target.y = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
  };
  const onContextLost = (event: Event) => {
    event.preventDefault(); contextLost = true; delete canvas.dataset.renderer; syncLoop();
  };
  // If a GPU context is lost, the CSS arch remains available for the rest of this visit.
  canvas.addEventListener('webglcontextlost', onContextLost);
  hero.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', syncLoop);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  const intersectionObserver = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; syncLoop(); });
  intersectionObserver.observe(hero);
  document.fonts.ready.then(() => { if (!destroyed) resize(); });
  canvas.dataset.renderer = 'webgl';
  resize();

  return {
    setPaused(value) { paused = value; if (paused && elapsed === 0) draw(true); syncLoop(); },
    destroy() {
      destroyed = true;
      syncLoop();
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      hero.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', syncLoop);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      release();
    },
  };
}
