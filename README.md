# App Components Example App Server

This app server is part of the [App Components Example App](https://developers.asana.com/docs/example-app).

To get started, run:

1. Clone this repo:

```
git clone git@github.com:Asana/app-components-example-app.git
```

2. Install dependencies:

```
npm install
```

3. Create a `./.env` file (i.e., in the root directory) with the following configuration:

```
CLIENT_SECRET="your_client_secret_here"
```

4. Enable HTTPS by:

   1. Generating keys and certificate:

   ```
   openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
   ```

   2. Getting decrypted keys:

   ```
   openssl rsa -in keytmp.pem -out key.pem
   ```

5. Start the server:

```
node index.js
```

6. If blocked by Chrome when opening your page (e.g., an SSL warning), click anywhere in the browser and type:

```
thisisunsafe
```

## Resources:

- [Overview of App Components](https://developers.asana.com/docs/overview-of-app-components)
- [Getting Started](https://developers.asana.com/docs/getting-started) with App Components
