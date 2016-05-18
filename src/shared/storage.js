// Promise-ify chrome.storage.local

function get(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, items => {
      resolve(items);
    });
  });
}

function set(items) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => resolve())
  });
}

export default {
  get,
  set,
};
