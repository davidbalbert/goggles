import _ from 'underscore';
import { selectOne } from './dom';

export const AUTH_URL = __RC_API_BASE__ + '/goggles/auth';
const QUERY_URL = __RC_API_BASE__ + '/api/goggles/query';

const SUCCESS_MESSAGE = 'RC Goggles is authenticated! Feel free to close this tab.';
const FAILURE_MESSAGE = `RC Goggles failed to authenticate. Please email <a href="mailto:faculty@recurse.com&quot;">faculty@recurse.com</a> or ping <strong>@Faculty</strong> on Zulip.<br>Please include any information that was printed in this tab's console.`;

function setMessage(msg) {
  selectOne(document, "#goggles-message").innerHTML = msg;
}

function setSuccessMessage() {
  setMessage(SUCCESS_MESSAGE);
}

function authenticate() {
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

  fetch(AUTH_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(response => {
    if (response.ok) {
      response.json().then(respData => {
	chrome.runtime.sendMessage({
	  type: 'authComplete',
	  data: respData,
	});

	setMessage(SUCCESS_MESSAGE);
      });
    } else {
      setMessage(FAILURE_MESSAGE);
    }
  });
}

function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({type: 'getAccessToken'}, response => {
      const { accessToken } = response;

      resolve(accessToken);
    });
  });
}

function makeQuery(things, key, param) {
  return accessToken => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);

    const data = {
      [param]: things.map(thing => thing[key]),
    }

    return fetch(QUERY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  };
}

function formatResponse(things, param) {
  return response => {
    if (response.ok) {
      return response.json().then(data => {
	const zipped = things.zip(data[param]);

	return zipped.map(([thing, isRC]) => {
	  return {
	    ...thing,
	    isRC
	  };
	});
      });
    } else {
      return Promise.reject('Error while querying RC API');
    }
  };
}

// Queries the RC API
function query(things, options) {
  if (!_.has(options, 'key')) {
    throw "missing key";
  } else if (!_.has(options, 'param')) {
    throw "missing param";
  }

  const key = options.key;
  const param = options.param;

  return getAccessToken().then(makeQuery(things, key, param)).then(formatResponse(things, param));
}

function queryAndFilter(things, options) {
  return query(things, options).then(queriedThings => _.filter(queriedThings, 'isRC'));
}

export default {
  AUTH_URL,
  authenticate,
  setSuccessMessage,
  query,
  queryAndFilter,
};
