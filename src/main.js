import * as HackerNews from './hn'

switch (window.location.host) {
  case 'news.ycombinator.com':
    HackerNews.annotate();
    break;
}

