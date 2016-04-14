export function select(thing, selector) {
  return thing.querySelectorAll(selector);
}

export function node(s) {
  const div = document.createElement('div');
  div.innerHTML = s;

  return div.firstChild;
}

