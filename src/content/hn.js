import _ from 'underscore';
import { select, node } from './dom';
import RecurseCenter from './rc';

const USER_URL = "https://news.ycombinator.com/user?";

function hasChildOfType(node, childType) {
  return _.any(node.children, child => child.nodeName.toLowerCase() === childType.toLowerCase());
}

function getStories() {
  const storyNodes = _.filter(select(document, '.athing'), n => {
    return select(n, '.title').length > 0 && // only get stories, comments are "things" too
      select(n, '.votelinks').length > 0;    // ignore job posts
  });

  const submitterNodes = _.filter(select(document, '.subtext > a'), a => {
    return a.href.indexOf(USER_URL) === 0;
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

function getComments() {
  const links = select(document, '.comhead > a');

  const userLinks = _.filter(links, a => {
    return a.href.indexOf(USER_URL) === 0;
  });

  return userLinks.map(a => {
    return {
      user: a.innerText,
      userNode: a,
    };
  });
}

function annotateNode(n) {
  const logo1x = chrome.extension.getURL('images/logo12.png');
  const logo2x = chrome.extension.getURL('images/logo24.png');

  // the space after '<span>' is intentional
  const annotation = node(`<span> <img alt="RC logo" srcset="${logo1x}, ${logo2x} 2x" src="${logo1x}"></span>`);

  n.appendChild(annotation);
}

function annotateUser(story) {
  annotateNode(story.userNode);
}

function annotateStory(story) {
  annotateNode(story.titleNode);
}

async function annotate() {
  const stories = getStories();
  const comments = getComments();

  const [rcStories, rcSubmissions, rcComments] = await Promise.all(
    [
      RecurseCenter.queryAndFilter(stories, {key: 'url', param: 'url'}),
      RecurseCenter.queryAndFilter(stories, {key: 'user', param: 'hacker_news'}),
      RecurseCenter.queryAndFilter(comments, {key: 'user', param: 'hacker_news'}),
    ]
  );


  for (let story of rcStories) {
    annotateStory(story);
  }

  for (let story of rcSubmissions) {
    annotateUser(story);
  }

  for (let comment of rcComments) {
    annotateUser(comment);
  }
}

export default {
  annotate
};
