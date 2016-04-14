import _ from 'underscore';
import { select, node } from './dom';

const Users = [
  "ymse",
  "steveklabnik",
];

const Domains = [
  "visualstudio.com",
  "graphics.latimes.com",
];

function hasChildOfType(node, childType) {
  return _.any(node.children, child => child.nodeName.toLowerCase() === childType.toLowerCase());
}

function getStories() {
  const storyNodes = _.filter(select(document, '.athing'), n => {
    return select(n, '.title').length > 0 && // only get stories, comments are "things" too
      select(n, '.votelinks').length > 0;    // ignore job posts
  });

  const submitterNodes = _.filter(select(document, '.subtext > a'), a => {
    return a.href.indexOf("https://news.ycombinator.com/user?") === 0;
  });

  const stories = _.map(storyNodes, (storyNode, i) => {
    const title = _.find(select(storyNode, '.title'), n => hasChildOfType(n, 'a'));
    const link = select(title, 'a')[0];

    return {
      title: link.innerText,
      url: link.href,
      user: submitterNodes[i].innerText,
      titleNode: title,
      userNode: submitterNodes[i],
    };
  });

  return stories;
}

function annotateNode(n) {
  const logo1x = chrome.extension.getURL('images/logo12.png');
  const logo2x = chrome.extension.getURL('images/logo24.png');

  const annotation = node(`<span> <img alt="RC logo" srcset="${logo1x}, ${logo2x} 2x" src="${logo1x}"></span>`);

  n.appendChild(annotation);
}

function annotateSubmitter(story) {
  annotateNode(story.userNode);
}

function annotateStory(story) {
  annotateNode(story.titleNode);
}

export function annotate() {
  const stories = getStories();

  const rcStories = stories.filter(s => _.any(Domains, d => s.url.indexOf(d) !== -1));
  const rcSubmissions = stories.filter(s => _.contains(Users, s.user));

  for (let story of rcStories) {
    annotateStory(story);
  }

  for (let story of rcSubmissions) {
    annotateSubmitter(story);
  }
}
