const { JSDOM } = require('jsdom');

const { window } = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head></head>
    <body></body>
  </html>
`);

function copyProperties(src, target) {
  const propertiesToDefine = Object.getOwnPropertyNames(src)
    .filter(propKey => typeof target[propKey] === 'undefined')
    .reduce(
      (propMap, propKey) => ({
        ...propMap,
        [propKey]: Object.getOwnPropertyDescriptor(src, propKey)
      }),
      {}
    );

  Object.defineProperties(target, propertiesToDefine);
}

const setupBrowserEnv = () => {
  global.window = window;
  global.document = window.document;
  global.navigator = { userAgent: 'node.js' };
  copyProperties(window, global);
};

setupBrowserEnv();
