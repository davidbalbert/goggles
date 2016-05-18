import { AUTH_URL, QUERY_URL } from './shared/constants';
import Storage from './shared/storage';

async function authenticateIfNecessary() {
  const {accessToken} = await Storage.get('accessToken');

  if (!accessToken) {
    chrome.tabs.create({url: AUTH_URL});
  }
}

chrome.runtime.onInstalled.addListener(authenticateIfNecessary);


async function handleQuery(request, sender, sendResponse) {
  const {things, key, param} = request;
  const {accessToken} = await Storage.get('accessToken');

  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${accessToken}`);

  const data = {
    [param]: things.map(thing => thing[key]),
  }

  const response = await fetch(QUERY_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    sendResponse({error: `Error ${response.status} while querying the RC API`});
    return;
  }

  const results = await response.json();
  sendResponse({results});
}

const HANDLERS = {
  query: handleQuery,
};

function handleMessage(request, sender, sendResponse) {
  const h = HANDLERS[request.type];

  if (!h) {
    console.warn(`Unknown message type: ${request.type}`);
  }

  const res = h(request, sender, sendResponse);

  // If our handler returns a promise, assume we're calling sendResponse
  // asynchronously and let the browser know about it.
  if (res instanceof Promise) {
    return true;
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
