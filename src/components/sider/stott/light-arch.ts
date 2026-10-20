/** Decorative arch only. Payment panels and QR codes never enter this renderer. */
export interface LightArch {
  setPaused(paused: boolean): void;
  destroy(): void;
}

const fillDuration = 2600;
const vertexSource = `precision highp float;
attribute vec3 a_target;
attribute vec3 a_seed;
uniform float u_time, u_dpr, u_static;
uniform vec2 u_resolution;
varying float v_alpha, v_tone;
void main() {
  float progress = u_static > .5 ? 1.0 : clamp(u_time / 2.6, 0.0, 1.0);
  float fill = 1.0 - pow(1.0 - progress, 2.0);
  vec2 position = a_target.xy + (a_seed.xz - .5) * 6.5;
  gl_Position = vec4(position.x / u_resolution.x * 2.0 - 1.0,
                     1.0 - position.y / u_resolution.y * 2.0, 0.0, 1.0);
  gl_PointSize = (2.4 + a_seed.z * 3.0) * u_dpr;
  // Only the fill front moves. Completed light has no shimmer or drift.
  float revealed = smoothstep(a_target.z, a_target.z + .035, fill * 1.035);
  v_alpha = (.18 + a_seed.x * .18) * revealed;
  v_tone = a_seed.y;
}`;

const fragmentSource = `precision highp float;
varying float v_alpha, v_tone;
void main() {
  vec2 uv = gl_PointCoord - .5;
  float r = dot(uv, uv);
  if (r > .25) discard;
  vec3 c = mix(vec3(.97, .88, .65), vec3(.95, .78, .42), v_tone);
  gl_FragColor = vec4(c, v_alpha * exp(-r * 11.0));
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
    positions.push(0, 0, 0);
    random.push(seed(i), seed(i + 120000), seed(i + 90000));
  }
  function attribute(name: string, values: number[]) {
    const buffer = gl!.createBuffer();
    if (!buffer) return null;
    buffers.push(buffer);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(values), gl!.STATIC_DRAW);
    const location = gl!.getAttribLocation(program!, name);
    if (location < 0) return null;
    gl!.enableVertexAttribArray(location);
    gl!.vertexAttribPointer(location, 3, gl!.FLOAT, false, 0, 0);
    return buffer;
  }
  const targetBuffer = attribute('a_target', positions);
  if (!targetBuffer || !attribute('a_seed', random)) { release(); return fallback; }
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = { time: uniform('u_time'), dpr: uniform('u_dpr'), resolution: uniform('u_resolution'), fixed: uniform('u_static') };
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.disable(gl.DEPTH_TEST);

  let width = 1, height = 1, dpr = 1, frame = 0, lastFrame = 0, elapsed = 0;
  // Reduced motion starts fully filled; other visits fill exactly once.
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let onScreen = true, destroyed = false, contextLost = false;

  const canAnimate = () => !destroyed && !contextLost && !paused && onScreen && !document.hidden && elapsed < fillDuration;

  function draw(staticFrame = false) {
    if (destroyed || contextLost) return;
    gl!.useProgram(program);
    gl!.uniform1f(uniforms.time, staticFrame ? 4 : elapsed / 1000);
    gl!.uniform1f(uniforms.dpr, dpr);
    gl!.uniform2f(uniforms.resolution, width, height);
    gl!.uniform1f(uniforms.fixed, staticFrame ? 1 : 0);

    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.POINTS, 0, pointCount);
  }
  function tick(now: number) {
    frame = 0;
    if (!canAnimate()) return;
    if (!lastFrame || now - lastFrame >= 32) {
      elapsed = Math.min(fillDuration, elapsed + (lastFrame ? Math.min(now - lastFrame, 100) : 0));
      lastFrame = now;
      draw();
    }
    if (canAnimate()) frame = requestAnimationFrame(tick);
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
    const inset = Math.max(8, Math.min(width * .08, (copy?.left ?? bounds.left + 30) - bounds.left - 18));
    const top = 12;
    const shoulder = Math.min(height - 28, Math.max(height * .68, (title?.bottom ?? bounds.top + 100) - bounds.top + 20));
    // Fit to the measured heading, including the glow radius. A fixed curve
    // crosses long headings on short laptops and narrow phones.
    const titleProgress = Math.max(.01, Math.min(.95, ((title?.top ?? bounds.top + 70) - bounds.top - 6 - top) / (shoulder - top)));
    const clearance = Math.max(1, (title?.left ?? bounds.left + 30) - bounds.left - 12 - inset);
    const remainingWidth = Math.min(.99, clearance / (width * .5 - inset));
    const spread = Math.max(5, Math.log(remainingWidth) / Math.log(1 - titleProgress) + 1);
    // Sample by actual pixel distance, not the curve parameter. This gives the
    // crown the same light density and thickness as the upright sides.
    const samples: { x: number; y: number; distance: number }[] = [];
    let length = 0;
    for (let step = 0; step <= 512; step++) {
      const p = step / 512;
      const curve = Math.min(p / .38, 1);
      const x = width * .5 - (width * .5 - inset) * (1 - (1 - curve) ** spread);
      const y = p < .38 ? top + (shoulder - top) * curve : shoulder + (height - 8 - shoulder) * (p - .38) / .62;
      const previous = samples.at(-1);
      if (previous) length += Math.hypot(x - previous.x, y - previous.y);
      samples.push({ x, y, distance: length });
    }
    for (let i = 0; i < pointCount; i++) {
      const distance = seed(Math.floor(i / 2) + 60000) * length;
      let low = 0, high = samples.length - 1;
      while (high - low > 1) {
        const middle = (low + high) >> 1;
        if (samples[middle].distance < distance) low = middle;
        else high = middle;
      }
      const a = samples[low], b = samples[high];
      const mix = (distance - a.distance) / Math.max(b.distance - a.distance, .001);
      const x = a.x + (b.x - a.x) * mix;
      positions[i * 3] = i % 2 ? width - x : x;
      positions[i * 3 + 1] = a.y + (b.y - a.y) * mix;
      positions[i * 3 + 2] = 1 - distance / length;
    }
    gl!.bindBuffer(gl!.ARRAY_BUFFER, targetBuffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(positions), gl!.DYNAMIC_DRAW);
    if (paused) elapsed = fillDuration;
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
    setPaused(value) { paused = value; if (paused) { elapsed = fillDuration; draw(true); } syncLoop(); },
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
