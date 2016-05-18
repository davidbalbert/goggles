import { AUTH_URL } from './shared/constants';
import Storage from './shared/storage';

async function authenticateIfNecessary() {
  let {token} = await Storage.get('accessToken');

  if (!token) {
    chrome.tabs.create({url: AUTH_URL});
  }
}

chrome.runtime.onInstalled.addListener(authenticateIfNecessary);
