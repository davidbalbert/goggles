# RC Goggles

Recurse Center Goggles is a Chrome extension that points out other Recursers as you surf the web.

## Installing

Once it is released, you will be able to get RC Goggles from the Chrome Web Store.

## Developing

```
$ npm install
$ npm run watch
```

Go to chrome://extensions and load Goggles with the "Load unpacked extension..." button.

### Developing against a local backend

If you have access to the recurse.com source code and want to develop the extension against the backend locally, create a file called `.env` with the following structure:

```
RC_API_BASE=http://localhost:5000
```

### Installing or upgrading a dependency

Because this is a browser extension, all dependencies are dev dependencies. To install a new extension, run:

```
$ npm install underscore --save-dev
$ npm shrinkwrap --dev
```

## License

Copyright 2017 the Recurse Center.

This software is licensed under the terms of the GPL Version 3 or later. See COPYING.md for more details.
