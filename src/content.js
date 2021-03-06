import { AUTH_URL } from './shared/constants';

import RecurseCenter from './content/rc';
import HackerNews from './content/hn';
import Storage from './shared/storage';

function annotate() {
  switch (window.location.host) {
    case 'news.ycombinator.com':
      HackerNews.annotate();
      break;
  }
}

async function isAuthenticated() {
  let {accessToken} = await Storage.get('accessToken');

  if (accessToken) {
    return true;
  } else {
    return false;
  }
}

async function init() {
  let authenticated = await isAuthenticated();

  if (window.location.href === AUTH_URL && authenticated) {
    // show the success message if we've already authenticated so it doesn't
    // look like we've hung.
    RecurseCenter.setSuccessMessage();
  } else if (window.location.href === AUTH_URL) {
    RecurseCenter.authenticate();
  } else if (authenticated) {
    annotate();
  }
}

init();
