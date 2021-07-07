# App Components Example App

This is the backend for the developer example app. This will help developers quickly get started with [App Components](https://developers.asana.com/docs/ui-components-overview).

To get started, run:

1. Clone this repo `git clone git@github.com:Asana/app-components-example-app.git`
2. Run `npm install`
3. Enable HTTPS
    1. Generate keys and certificate: `openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365`
    2. Get decrypted keys: `openssl rsa -in keytmp.pem -out key.pem`
4. Run `node index.js`
5. If blocked by Chrome when opening your page, click anywhere on the browser and type: `thisisunsafe`

