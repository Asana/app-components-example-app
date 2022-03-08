# App Components Example App Server

This app server is part of the [App Components Example App](https://developers.asana.com/docs/example-app). By following the aforementioned guide, you'll see how an example Express server communicates with requests made from the client. In particular, you'll be able to demo:

* [Widget](https://developers.asana.com/docs/widget)
* [Modal Form](https://developers.asana.com/docs/modal-form)
* [Lookup](https://developers.asana.com/docs/lookup)
* [Entry Point](https://developers.asana.com/docs/entry-point) (within the Asana UI)

Note that due to the infrastructure behind [App Rules](https://developers.asana.com/docs/rule-action), this repository does not include an example of App Rules running in a local server.

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
node index.js
```

5. If blocked by Chrome when opening your page (e.g., an SSL warning), click anywhere in the browser and type:

```
thisisunsafe
```

## Resources:

- [Overview of App Components](https://developers.asana.com/docs/overview-of-app-components)
- [Getting Started](https://developers.asana.com/docs/getting-started) with App Components
