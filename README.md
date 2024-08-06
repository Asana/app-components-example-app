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
4. Create an app in the Asana [developer console](https://app.asana.com/0/my-apps)
5.  Naviate to your app's **"App Components"** page `https://app.asana.com/0/my-apps/<YOUR_APP's_ID>/app-components`
6.  Configure your **"Modal form"** > **"Form metadata URL"** > `https://localhost:8000/form/metadata`
7.  Configure your **"Look up"**:
    1. **"Resource attach URL"** > `https://localhost:8000/search/attach`
    2. **"Placeholder text"** > `<NAME_THIS_WHATEVER_YOU_WANT>`
    3. **"Resource typeahead URL"** > `https://localhost:8000/search/typeahead`
8.  Configure your **"Widget"**:
    1.  **"Widget metadata URL"** > `https://localhost:8000/widget`
    2.  **"Match URL pattern"** > `^https:\/\/localhost:8000\/(.*)?$` OR if you want to match everything `.*`
9.  Congiure your **"Entry point"**:
    1.  **"Lookup action text"** > `<ENTER_WHATEVER_YOU_WANT>` EX: `Lookup`
    2.  **"Modal form action text"** > `<ENTER_WHATEVER_YOU_WANT>` EX: `Modal form`
    3.  **"Dropdown button text"** > `<ENTER_WHATEVER_YOU_WANT>` EX: `Dropdown`
10. Naviate to your app's **"Manage distribution"** page `https://app.asana.com/0/my-apps/<YOUR_APP's_ID>/manage-distribution`
11. Select **"Specific workspaces"** > **"+ Add workspace"** > add a workspace you want your app to be installed on OR select **"Any workspace"** if you want your app to be available to any workspace
12. Naviate to your app's **"OAuth"** page `https://app.asana.com/0/my-apps/<YOUR_APP's_ID>/oauth`
13. Click on **"+ Add redirect URL"** and add the following as your redirect URL `https://localhost:8000/oauth/callback`
14. Under **"Custom authentication URL"** add `https://localhost:8000/oauth` then click on **"Save changes"**
15. Note down your app's `Client ID` and app's `Client secret`. Create a `.env` file in your root directory with the following contents (see `.env-example` for an example of what the contents should look like):
   ```
   CLIENT_ID=<YOUR_APP's_APP_ID/CLIENT_ID>
   CLIENT_SECRET=<YOUR_APP's_CLIENT_SECRET>
   COOKIE_SECRET=<SOME_SECRET_VALUE>
   ```
16. Start the server (must be kept running when using the app in Asana):

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
