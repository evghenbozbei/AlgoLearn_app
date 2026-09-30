// Match Vite's URL imports when rendering components in Node tests.
export async function resolve(specifier, context, nextResolve) {
  // Canvas animation is cosmetic; the DOM tests exercise scoring and navigation.
  if (specifier === 'canvas-confetti') {
    return { url: 'data:text/javascript,export default function confetti() {}', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.jpg')) {
    return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(url)};` };
  }
  return nextLoad(url, context);
}
