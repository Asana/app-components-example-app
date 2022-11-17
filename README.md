# App Components Example App Server

This app server is part of the [app components example app](https://developers.asana.com/docs/example-apps). By following the aforementioned guide, you'll see how an example [Express](https://expressjs.com/) server communicates with requests made from the client. In particular, you'll be able to demo:

- [Widget](https://developers.asana.com/docs/widget)
- [Modal form](https://developers.asana.com/docs/modal-form)
- [Lookup](https://developers.asana.com/docs/lookup)
- [Entry point](https://developers.asana.com/docs/entry-point) (within the Asana UI)

Note: To view an example app server with [rule actions](https://developers.asana.com/docs/rule-action), see [app-components-rule-action-example-app](https://github.com/Asana/app-components-rule-action-example-app).

## Getting Started

1. Clone this repo:

```
git clone git@github.com:Asana/app-components-example-app.git
```

2. Install dependencies:

```
npm install
```

3. Enable HTTPS by:

   1. Generating keys and certificate:

   ```
   openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
   ```

   2. Getting decrypted keys:

   ```
   openssl rsa -in keytmp.pem -out key.pem
   ```

4. Start the server (must be kept running when using the app in Asana):

```
npm run dev
```

5. If blocked by Chrome when opening your page (e.g., an SSL warning), click anywhere in the browser and type:

```
thisisunsafe
```

## Resources:

- [Overview of app components](https://developers.asana.com/docs/overview-of-app-components)
- [Getting started](https://developers.asana.com/docs/getting-started) with app components
