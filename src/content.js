import RecurseCenter from './content/rc';
import HackerNews from './content/hn';

function annotate() {
  switch (window.location.host) {
    case 'news.ycombinator.com':
      HackerNews.annotate();
      break;
  }
}

chrome.runtime.sendMessage({type: 'isAuthenticated'}, response => {
  if (window.location.href === RecurseCenter.AUTH_URL && response.authenticated) {
    // show the success message if we've already authenticated so it doesn't
    // look like we've hung.
    RecurseCenter.setSuccessMessage();
  } else if (window.location.href === RecurseCenter.AUTH_URL) {
    RecurseCenter.authenticate();
  } else if (response.authenticated) {
    annotate();
  }
});
