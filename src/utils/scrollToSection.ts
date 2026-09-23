const NEED_SECTION = 'studio:need-section';

export function requestSection(selector: string) {
  window.dispatchEvent(new CustomEvent(NEED_SECTION, { detail: selector }));
}

export function onNeedSection(handler: (selector: string) => void) {
  const listener = (event: Event) => {
    const selector = (event as CustomEvent<string>).detail;
    if (typeof selector === 'string') handler(selector);
  };
  window.addEventListener(NEED_SECTION, listener);
  return () => window.removeEventListener(NEED_SECTION, listener);
}

export function scrollToSection(selector: string) {
  const go = () => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  if (document.querySelector(selector)) {
    go();
    return;
  }
  requestSection(selector);
  const started = Date.now();
  const tick = () => {
    if (document.querySelector(selector)) go();
    else if (Date.now() - started < 5000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
