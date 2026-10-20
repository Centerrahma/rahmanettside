/** Decorative arch only. Payment panels and QR codes never enter this renderer. */
export interface LightArch {
  setPaused(paused: boolean): void;
  destroy(): void;
}

const vertexSource = `precision highp float;
attribute vec3 a_target;
attribute vec3 a_seed;
uniform float u_time, u_dpr, u_static, u_spread;
uniform vec2 u_resolution;
uniform vec4 u_arch;
varying float v_alpha, v_tone;
void main() {
  // Travel along the arch itself, rather than collapsing a cloud across the copy.
  float t = u_static > .5 ? 0.0 : u_time;
  float p = fract(a_target.y - t * .025);
  float curve = min(p / .38, 1.0);
  float spread = u_spread;
  float x = mix(u_resolution.x * .5, a_target.x < 0.0 ? u_arch.x : u_arch.y,
                1.0 - pow(1.0 - curve, spread));
  float y = p < .38
    ? mix(u_arch.z, u_arch.w, curve)
    : mix(u_arch.w, u_resolution.y - 8.0, (p - .38) / .62);
  // Fine, even strands: depth changes the light, never the silhouette.
  x += (a_seed.x - .5) * 5.0;
  y += (a_seed.z - .5) * 3.0;
  gl_Position = vec4(x / u_resolution.x * 2.0 - 1.0,
                     1.0 - y / u_resolution.y * 2.0, 0.0, 1.0);
  gl_PointSize = (1.6 + a_seed.z * 2.0) * u_dpr;
  float entrance = u_static > .5 ? 1.0 : smoothstep(p * .75, p * .75 + 1.2, t);
  float shimmer = .65 + .35 * sin(p * 18.0 - t * .65 + a_seed.y * 6.28);
  // Fade at the apex and foot so recycling particles never jump visibly.
  float edge = smoothstep(0.0, .025, p) * (1.0 - smoothstep(.82, 1.0, p));
  // A wide crown covers more pixels per particle than a rail. Compensate for
  // that spacing so the crown remains connected instead of disappearing.
  float speed = p < .38
    ? length(vec2((u_arch.y - u_arch.x) * spread * .5 * pow(1.0 - curve, spread - 1.0), u_arch.w - u_arch.z)) / .38
    : (u_resolution.y - 8.0 - u_arch.w) / .62;
  float density = clamp(speed / 650.0, .65, 4.0);
  v_alpha = (.10 + a_seed.x * .15) * density * shimmer * edge * entrance;
  v_tone = a_seed.y;
}`;

const fragmentSource = `precision highp float;
varying float v_alpha, v_tone;
void main() {
  vec2 uv = gl_PointCoord - .5;
  float r = dot(uv, uv);
  if (r > .25) discard;
  vec3 c = mix(vec3(.97, .88, .65), vec3(.95, .78, .42), v_tone);
  gl_FragColor = vec4(c, v_alpha * exp(-r * 14.0));
}`;
const pointCount = 9000;
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
    positions.push(i % 2 ? 1 : -1, seed(i + 60000), 0);
    random.push(seed(i), seed(i + 120000), seed(i + 90000));
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
  const uniforms = { time: uniform('u_time'), dpr: uniform('u_dpr'), resolution: uniform('u_resolution'), fixed: uniform('u_static'), arch: uniform('u_arch'), spread: uniform('u_spread') };
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.disable(gl.DEPTH_TEST);

  let width = 1, height = 1, dpr = 1, frame = 0, lastFrame = 0, elapsed = 0;
  // Match the actual preference before the first draw. Starting paused painted
  // the finished arch, then jumped back to scattered particles when React resumed it.
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let onScreen = true, destroyed = false, contextLost = false;

  const archBounds = new Float32Array(4);
  let spread = 5;
  const canAnimate = () => !destroyed && !contextLost && !paused && onScreen && !document.hidden;

  function draw(staticFrame = false) {
    if (destroyed || contextLost) return;
    gl!.useProgram(program);
    gl!.uniform1f(uniforms.time, staticFrame ? 4 : elapsed / 1000);
    gl!.uniform1f(uniforms.dpr, dpr);
    gl!.uniform2f(uniforms.resolution, width, height);
    gl!.uniform1f(uniforms.fixed, staticFrame ? 1 : 0);
    gl!.uniform4fv(uniforms.arch, archBounds);
    gl!.uniform1f(uniforms.spread, spread);
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
    const title = hero.querySelector('h1')?.getBoundingClientRect();
    const copy = hero.querySelector('blockquote')?.parentElement?.getBoundingClientRect();
    // Keep the crown above the heading and both rails outside the whole copy.
    // Pixel-space bounds preserve the complete arch on portrait screens too.
    const inset = Math.max(5, Math.min(width * .08, (copy?.left ?? bounds.left + 30) - bounds.left - 18));
    const top = 12;
    const shoulder = Math.min(height - 28, Math.max(height * .68, (title?.bottom ?? bounds.top + 100) - bounds.top + 20));
    // Fit to the measured heading, including the glow radius. A fixed curve
    // crosses long headings on short laptops and narrow phones.
    const titleProgress = Math.max(.01, Math.min(.95, ((title?.top ?? bounds.top + 70) - bounds.top - 6 - top) / (shoulder - top)));
    const clearance = Math.max(1, (title?.left ?? bounds.left + 30) - bounds.left - 12 - inset);
    const remainingWidth = Math.min(.99, clearance / (width * .5 - inset));
    spread = Math.max(5, Math.log(remainingWidth) / Math.log(1 - titleProgress) + 1);
    archBounds.set([inset, width - inset, top, shoulder]);
    draw(paused);
  }
  const onContextLost = (event: Event) => {
    event.preventDefault(); contextLost = true; delete canvas.dataset.renderer; syncLoop();
  };
  // If a GPU context is lost, the CSS arch remains available for the rest of this visit.
  canvas.addEventListener('webglcontextlost', onContextLost);
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
      document.removeEventListener('visibilitychange', syncLoop);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      release();
    },
  };
}
