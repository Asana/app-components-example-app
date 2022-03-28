const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 8000;
const crypto = require("crypto");

// Parse JSON bodies
app.use(express.json());

// Enable CORS (https://developers.asana.com/docs/security)
app.use(
  cors({
    origin: "https://app.asana.com",
  })
);

// Run before every API request
app.use((req, res, next) => {
  // Assess timeliness (https://developers.asana.com/docs/timeliness)
  const expirationDate = req.query.expires_at || req.body.expires_at;
  const currentDate = new Date();

  if (currentDate.getTime() > new Date(expirationDate).getTime()) {
    console.log("Request expired.");
    return;
  }

  // Assess message integrity (https://developers.asana.com/docs/message-integrity).
  // The code below is commented because we cannot publicly share the signature's Client Secret.
  // For more information on the Client Secret, feel free to review the link above.

  // Verify that the signature exists
  // if (!req.headers["x-asana-request-signature"]) {
  //   console.log("Signature is missing.");
  //   return;
  // }

  // let stringToVerify;
  // let secret = "my_client_secret_string";

  // if (req.method === "POST") {
  //   stringToVerify = req.body.data.toString();
  // } else if (req.method === "GET") {
  //   stringToVerify = req._parsedUrl.query;
  // }

  // let computedSignature = crypto
  //   .createHmac("sha256", secret)
  //   .update(stringToVerify)
  //   .digest("hex");
  // if (
  //   !crypto.timingSafeEqual(
  //     Buffer.from(req.headers["x-asana-request-signature"]),
  //     Buffer.from(computedSignature)
  //   )
  // ) {
  //   console.log("Request cannot be verified.");
  //   res.status(400);
  //   return;
  // } else {
  //   console.log("Request verified!");
  // }

  next();
});

// -------------------- Client endpoint for auth (see auth.html) --------------------

app.get("/auth", (req, res) => {
  // We recommend creating a secure Oauth flow (https://developers.asana.com/docs/oauth)
  console.log("Auth happened!");
  res.sendFile(path.join(__dirname, "/auth.html"));
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
  resource_url: "https://localhost:8000",
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
    footer: "I'm a footer",
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
    on_submit_callback: "https://localhost:8000/form/submit",
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
        typeahead_url: "https://localhost:8000/search/typeahead",
        placeholder: "[half width]",
        width: "half",
      },
      {
        name: "I'm a typeahead",
        type: "typeahead",
        id: "typeahead_full_width",
        is_required: false,
        typeahead_url: "https://localhost:8000/search/typeahead",
        placeholder: "[full width]",
        width: "full",
      },
    ],
    on_change_callback: "https://localhost:8000/form/onchange",
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
      `Example app listening on port ${port}! Go to https://localhost:${port}/`
    );
  });
