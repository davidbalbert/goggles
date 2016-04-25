import { selectOne } from './dom';

export const AUTH_URL = __RC_API_BASE__ + '/goggles/auth';

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
      response.json().then(data => {
	chrome.runtime.sendMessage({
	  type: 'authComplete',
	  data,
	});

	setMessage(SUCCESS_MESSAGE);
      });
    } else {
      setMessage(FAILURE_MESSAGE);
    }
  });
}

export default {
  AUTH_URL,
  authenticate,
  setSuccessMessage,
};
