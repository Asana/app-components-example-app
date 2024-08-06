require("dotenv").config();

// Packages
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const https = require("https");
const { v4: uuidv4 } = require("uuid");

// Constants
const port = 8000;
const baseURL = `https://localhost:${port}`;
const redirectUri = `${baseURL}/oauth/callback`;

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS (https://developers.asana.com/docs/security)
app.use(
  cors({
    origin: "https://app.asana.com",
  })
);

// Enable storage of data in cookies.
// Signed cookies are signed by the COOKIE-SECRET environment variable.
app.use(cookieParser(process.env.COOKIE_SECRET));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Run before every API request
app.use((req, res, next) => {
  // Since Asana does not send `x-asana-request-signature` during oauth exchange.
  // Skip `x-asana-request-signature` check if it hits one of our /oauth endpoints (i.e., /oauth and /oauth/callback)
  // or if it's a favicon request.
  if (req._parsedUrl.pathname.includes('/oauth') || req._parsedUrl.pathname.includes('/favicon.ico')) {
    next();
    return;
  }

  // Assess timeliness (https://developers.asana.com/docs/timeliness)
  const expirationDate = req.query.expires_at || JSON.parse(req.body.data).expires_at;
  const currentDate = new Date();

  // Check request expiration date if it's included in the request.
  if (currentDate.getTime() > new Date(expirationDate).getTime()) {
    console.log("Request expired.");
    res.status(408).send("Request expired.");
    return;
  }

  // Assess message integrity (https://developers.asana.com/docs/message-integrity).
  // The code below is commented because we cannot publicly share the signature's Client Secret.
  // For more information on the Client Secret, feel free to review the link above.

  // Verify that the signature exists
  if (!req.headers["x-asana-request-signature"]) {
    console.log("Request missing x-asana-request-signature");
    res.status(400).send("Request missing x-asana-request-signature");
    return;
  }

  let stringToVerify;

  if (req.method === "POST") {
    stringToVerify = req.body.data.toString();
  } else if (req.method === "GET") {
    stringToVerify = req._parsedUrl.query;
  }

  let computedSignature = crypto
    .createHmac("sha256", process.env.CLIENT_SECRET)
    .update(stringToVerify)
    .digest("hex");

  try {
    if (crypto.timingSafeEqual(
      Buffer.from(req.headers["x-asana-request-signature"]),
      Buffer.from(computedSignature)
    )) {
      console.log("Request verified!");
    } else {
      console.log("x-asana-request-signature validation failed");
      res.status(400).send("x-asana-request-signature validation failed");
      return;
    }
  } catch (error) {
    console.log("x-asana-request-signature validation failed");
    res.status(400).send("x-asana-request-signature validation failed");
    return;
  }

  next();
});

// -------------------- Client endpoints for OAuth --------------------

// Add this to the `Custom authentication URL` in your app's Asana Developer Console OAuth page
app.get("/oauth", (req, res) => {
  // Generate a `state` value and store it. We are generating UUIDs for this example to make it not guessable.
  // Docs: https://developers.asana.com/docs/oauth#response
  let generatedState = uuidv4();

  // Expiration of 5 minutes
  res.cookie("state", generatedState, {
    maxAge: 1000 * 60 * 5,
    signed: true,
  });

  let userAuthorizationLink = `https://app.asana.com/-/oauth_authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectUri}&state=${generatedState}`

  res.render("app_server_app_auth_page", {"userAuthorizationLink": userAuthorizationLink});
});

// Add this to the `Redirect URLs` in your app's Asana Developer Console OAuth page
app.get("/oauth/callback", (req, res) => {
  // Prevent CSRF attacks by validating the 'state' parameter.
  // Docs: https://developers.asana.com/docs/oauth#user-authorization-endpoint
  if (req.query.state !== req.signedCookies.state) {
    res.status(422).send("The 'state' parameter does not match.");
    return;
  }

  // Check if the user clicked on "deny" on the grant permissions page.
  // If so, let Asana know that the app auth failed.
  if(req.query.error === 'access_denied') {
    res.render("send_app_auth_info", {"status": 'error'});
  }

  console.log(
    "***** Code (to be exchanged for a token) and state from the user authorization response:\n"
  );

  // Body of the POST request to the token exchange endpoint.
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: redirectUri,
    code: req.query.code,
  };

  // Set Axios to serialize the body to urlencoded format.
  const config = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  // Make the request to the token exchange endpoint.
  // Docs: https://developers.asana.com/docs/oauth#token-exchange-endpoint
  axios
    .post("https://app.asana.com/-/oauth_token", body, config)
    .then((res) => {
      console.log("***** Response from the token exchange request:\n");
      console.log(res.data);
      return res.data;
    })
    .then((data) => {
      // Store tokens in cookies.
      // In a production app, you should store this data somewhere secure and durable instead (e.g., a database).
      res.cookie("access_token", data.access_token, { maxAge: 60 * 60 * 1000 });
      res.cookie("refresh_token", data.refresh_token, {
        // Prevent client-side scripts from accessing this data.
        httpOnly: true,
        secure: true,
      });

      // Let Asana know that the app component auth has completed successfully
      res.render("send_app_auth_info", {"status": 'success'});
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// -------------------- API endpoints --------------------

// Docs: https://developers.asana.com/docs/get-widget-metadata
app.get("/widget", (req, res) => {
  console.log("Widget happened!");
  res.json(widget_response);
});

// Docs: https://developers.asana.com/docs/get-form-metadata
app.get("/form/metadata", (req, res) => {
  console.log("Modal Form happened!");
  res.json(form_response);
});

// Docs: https://developers.asana.com/docs/get-lookup-typeahead-results
app.get("/search/typeahead", (req, res) => {
  console.log("Typeahead happened!");
  res.json(typeahead_response);
});

// Docs: https://developers.asana.com/docs/on-change-callback
app.post("/form/onchange", (req, res) => {
  console.log("OnChange happened!");
  console.log(req.body);
  res.json(form_response);
});

// Docs: https://developers.asana.com/docs/attach-resource
app.post("/search/attach", (req, res) => {
  console.log("Attach happened!");
  console.log(req.body);
  res.json(attachment_response);
});

// Docs: https://developers.asana.com/docs/on-submit-callback
app.post("/form/submit", (req, res) => {
  console.log("Modal Form submitted!");
  console.log(req.body);
  res.json(attachment_response);
});

// -------------------- Metadata responses --------------------
// Note that values should be computed based on business logic

attachment_response = {
  resource_name: "I'm an Attachment",
  resource_url: baseURL,
};

// Docs: https://developers.asana.com/docs/widget
widget_response = {
  template: "summary_with_details_v0",
  metadata: {
    fields: [
      {
        name: "I'm a name",
        type: "datetime_with_icon",
        datetime: "2012-02-22T02:06:58.147Z",
        icon_url: "https://placekitten.com/16/16",
      },
      {
        name: "I'm a name",
        type: "pill",
        text: "I'm text",
        color: "none",
      },
      {
        name: "I'm a name",
        type: "text_with_icon",
        text: "I'm text",
      },
      {
        name: "I'm a name",
        type: "pill",
        text: "I'm text",
        color: "hot-pink",
      },
      {
        name: "I'm a name",
        type: "text_with_icon",
        text: "I'm text",
        icon_url: "https://placekitten.com/16/16",
      },
    ],
    footer: {
      "footer_type": "custom_text",
      "icon_url": "https://example-icon.png",
      "text": "I'm a footer"
    },
    num_comments: 2,
    subicon_url: "https://placekitten.com/16/16",
    subtitle: "I'm a subtitle",
    title: "I'm a Widget",
  },
};

// Docs: https://developers.asana.com/docs/modal-form
form_response = {
  template: "form_metadata_v0",
  metadata: {
    title: "I'm a title",
    on_submit_callback: `${baseURL}/form/submit`,
    fields: [
      {
        name: "I'm a single_line_text",
        type: "single_line_text",
        id: "single_line_text_full_width",
        is_required: false,
        placeholder: "[full width]",
        width: "full",
      },
      {
        name: "I'm a single_line_text",
        type: "single_line_text",
        id: "single_line_text_half_width",
        is_required: false,
        placeholder: "[half width]",
        width: "half",
      },
      {
        name: "I'm a single_line_text with is_watched enabled",
        type: "single_line_text",
        id: "single_line_text_full_width_is_watched",
        is_required: false,
        is_watched: true,
        placeholder: "[full width]",
        width: "full",
      },
      {
        name: "I'm a multi_line_text",
        type: "multi_line_text",
        id: "multi_line_text",
        is_required: false,
        placeholder: "[placeholder]",
      },
      {
        type: "static_text",
        id: "static_text",
        name: "I'm a static_text",
      },
      {
        name: "I'm a rich_text",
        type: "rich_text",
        id: "rich_text",
        is_required: false,
        placeholder: "[placeholder]",
      },
      {
        name: "I'm a dropdown",
        type: "dropdown",
        id: "dropdown_half_width",
        is_required: false,
        options: [
          {
            id: "1",
            label: "I'm a label",
          },
          {
            id: "2",
            label: "I'm a label",
            icon_url: "https://placekitten.com/16/16",
          },
        ],
        width: "half",
      },
      {
        name: "I'm a dropdown",
        type: "dropdown",
        id: "dropdown_full_width",
        is_required: false,
        options: [
          {
            id: "1",
            label: "I'm a label",
          },
          {
            id: "2",
            label: "I'm a label",
            icon_url: "https://placekitten.com/16/16",
          },
        ],
        width: "full",
      },
      {
        name: "I'm a checkbox",
        type: "checkbox",
        id: "checkbox",
        is_required: false,
        options: [
          {
            id: "1",
            label: "I'm a label",
          },
          {
            id: "2",
            label: "I'm a label",
          },
        ],
      },
      {
        name: "I'm a radio_button",
        type: "radio_button",
        id: "radio_button",
        is_required: false,
        options: [
          {
            id: "1",
            label: "I'm a label",
          },
          {
            id: "2",
            label: "I'm a label",
            sub_label: "I'm a sub_label",
          },
        ],
      },
      {
        name: "I'm a date",
        type: "date",
        id: "date",
        is_required: false,
        placeholder: "[placeholder]",
      },
      {
        name: "I'm a datetime",
        type: "datetime",
        id: "datetime",
        is_required: false,
        placeholder: "[placeholder]",
      },
      {
        name: "I'm a typeahead",
        type: "typeahead",
        id: "typeahead_half_width",
        is_required: false,
        typeahead_url: `${baseURL}/search/typeahead`,
        placeholder: "[half width]",
        width: "half",
      },
      {
        name: "I'm a typeahead",
        type: "typeahead",
        id: "typeahead_full_width",
        is_required: false,
        typeahead_url: `${baseURL}/search/typeahead`,
        placeholder: "[full width]",
        width: "full",
      },
    ],
    on_change_callback: `${baseURL}/form/onchange`,
  },
};

typeahead_response = {
  items: [
    {
      title: "I'm a title",
      subtitle: "I'm a subtitle",
      value: "some_value",
      icon_url: "https://placekitten.com/16/16",
    },
    {
      title: "I'm a title",
      subtitle: "I'm a subtitle",
      value: "some_value",
      icon_url: "https://placekitten.com/16/16",
    },
  ],
};

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, function () {
    console.log(
      `Example app listening on port ${port}! Base URL: ${baseURL}`
    );
  });
