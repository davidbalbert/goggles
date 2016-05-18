import _ from 'underscore';
import Storage from '../shared/storage';
import { AUTH_URL } from '../shared/constants';
import { selectOne } from './dom';

const SUCCESS_MESSAGE = 'RC Goggles is authenticated! Feel free to close this tab.';
const FAILURE_MESSAGE = `RC Goggles failed to authenticate. Please email <a href="mailto:faculty@recurse.com&quot;">faculty@recurse.com</a> or ping <strong>@Faculty</strong> on Zulip.<br>Please include any information that was printed in this tab's console.`;

function setMessage(msg) {
  selectOne(document, "#goggles-message").innerHTML = msg;
}

function setSuccessMessage() {
  setMessage(SUCCESS_MESSAGE);
}

function saveCredentials(response) {
  return Storage.set(
    {
      accessToken: response.token.token,
      user: response.user
    }
  );
}

async function authenticate() {
  const csrfParamName = selectOne(document, 'meta[name=csrf-param]').attributes.content.value;
  const csrfToken = selectOne(document, 'meta[name=csrf-token]').attributes.content.value;

  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');

  const data = {
    [csrfParamName]: csrfToken,
    token: {
      note: "RC Goggles",
    },
  };

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    setMessage(FAILURE_MESSAGE);
    return;
  }

  const responseData = await response.json();
  await saveCredentials(responseData);
  setMessage(SUCCESS_MESSAGE);
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      resolve(response);
    });
  });
}

// Queries the RC API
async function query(things, options) {
  if (!_.has(options, 'key')) {
    throw "missing key";
  } else if (!_.has(options, 'param')) {
    throw "missing param";
  }

  const key = options.key;
  const param = options.param;

  const message = {
    type: 'query',
    things,
    key,
    param,
  }

  const response = await sendMessage(message);

  if (response.error) {
    console.error(response.error);
    return;
  }

  const zipped = _.zip(things, response.results[param]);

  return zipped.map(([thing, isRC]) => {
    return {
      ...thing,
      isRC
    };
  });
}

async function queryAndFilter(things, options) {
  let results = await query(things, options);
  return _.filter(results, 'isRC');
}

export default {
  authenticate,
  setSuccessMessage,
  query,
  queryAndFilter,
};
