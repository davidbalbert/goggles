export function select(thing, selector) {
  return thing.querySelectorAll(selector);
}

export function selectOne(thing, selector) {
  return thing.querySelector(selector);
}

export function node(s) {
  const div = document.createElement('div');
  div.innerHTML = s;

  return div.firstChild;
}
