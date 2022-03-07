const express = require('express')
const https = require('https')
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const app = express()
const port = 8000

app.use(cors());
app.use(express.json());

// Front end endpoints
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/auth', (req, res) => {
  console.log("Auth Happened!")
  res.sendFile(path.join(__dirname, '/auth.html'))
})

// This function runs before every api request. It validates the request.
app.use((req, res, next) => {
  // Check Expires
  const expires = req.query.expires || req.body.expires
  if (new Date().getTime() > expires) {
    console.log("Request Expired.")
    return
  }

  // For the example app, we can't share the signature's secret with you. For now, let's just validate the signature exists

  // Check Signature
  if (!req.headers["x-asana-request-signature"]) {
    console.log("Signature Missing.")
    return
  }

  // TODO: Replace signature check

  // let stringToVerify;
  // if (req.method === "POST") {
  //   stringToVerify = req.body.toString();
  // } else if (req.method === "GET") {
  //   stringToVerify = req.url.query;
  // }
  // let computedSignature = require("crypto").createHmac("sha256", secret)
  //   .update(stringToVerify)
  //   .digest("hex");
  // if (req.headers["x-asana-request-signature"] !== computedSignature) {
  //   return;
  // }

  next()
})

app.get('/widget', (req, res) => {
  console.log("Widget Happened!")
  res.json(widget_response)
})

app.get('/form/metadata', (req, res) => {
  console.log("Form Happened!")
  res.json(form_response)
})

app.get('/search/typeahead', (req, res) => {
  console.log("Typeahead Happened!")
  res.json(typeahead_response)
})

app.post('/form/onchange', (req, res) => {
  console.log("OnChange Happened!")
  console.log(req.body)
  res.json(form_response)
})

app.post('/search/attach', (req, res) => {
  console.log("Attach Happened!")
  console.log(req.body)
  res.json(attachment_response)
})

app.post('/form/submit', (req, res) => {
  console.log("Modal Submitted!")
  console.log(req.body)
  res.json(attachment_response)
})

attachment_response = {
  "resource_name": "I'm an Attachment",
  "resource_url": "https://localhost:8000"
}

widget_response = {
  "template": "summary_with_details_v0",
  "metadata": {
    "fields": [
      {
        "name": "I'm a name",
        "type": "pill",
        "text": "I'm text",
        "color": "none"
      },
      {
        "name": "I'm a name",
        "type": "text_with_icon",
        "text": "I'm text"
      },
      {
        "name": "I'm a name",
        "type": "pill",
        "text": "I'm text",
        "color": "hot-pink"
      },
      {
        "name": "I'm a name",
        "type": "text_with_icon",
        "text": "I'm text",
        "icon_url": "https://placekitten.com/16/16"
      }
    ],
    "footer": "I'm a footer",
    "num_comments": 2,
    "subicon_url": "https://placekitten.com/16/16",
    "subtitle": "I'm a subtitle",
    "title": "I'm a Widget"
  }
}

form_response = {
  "template": "form_metadata_v0",
  "metadata": {
    "title": "I'm a title",
    "on_submit_callback": "https://localhost:8000/form/submit",
    "fields": [
      {
        "name": "I'm a single_line_text",
        "type": "single_line_text",
        "id": "single_line_text_full_width",
        "is_required": false,
        "placeholder": "[full width]",
        "width": "full"
      },
      {
        "name": "I'm a single_line_text",
        "type": "single_line_text",
        "id": "single_line_text_half_width",
        "is_required": false,
        "placeholder": "[half width]",
        "width": "half"
      },
      {
        "name": "I'm a single_line_text with is_watched enabled",
        "type": "single_line_text",
        "id": "single_line_text_full_width_is_watched",
        "is_required": false,
        "is_watched": true,
        "placeholder": "[full width]",
        "width": "full"
      },
      {
        "name": "I'm a multi_line_text",
        "type": "multi_line_text",
        "id": "multi_line_text",
        "is_required": false,
        "placeholder": "[placeholder]"
      },
      {
        "type": "static_text",
        "id": "static_text",
        "name": "I'm a static_text"
      },
      {
        "name": "I'm a rich_text",
        "type": "rich_text",
        "id": "rich_text",
        "is_required": false,
        "placeholder": "[placeholder]"
      },
      {
        "name": "I'm a dropdown",
        "type": "dropdown",
        "id": "dropdown_half_width",
        "is_required": false,
        "options": [
          {
            "id": "1",
            "label": "I'm a label"
          },
          {
            "id": "2",
            "label": "I'm a label",
            "icon_url": "https://placekitten.com/16/16"
          }
        ],
        "width": "half"
      },
      {
        "name": "I'm a dropdown",
        "type": "dropdown",
        "id": "dropdown_full_width",
        "is_required": false,
        "options": [
          {
            "id": "1",
            "label": "I'm a label"
          },
          {
            "id": "2",
            "label": "I'm a label",
            "icon_url": "https://placekitten.com/16/16"
          }
        ],
        "width": "full"
      },
      {
        "name": "I'm a checkbox",
        "type": "checkbox",
        "id": "checkbox",
        "is_required": false,
        "options": [
          {
            "id": "1",
            "label": "I'm a label"
          },
          {
            "id": "2",
            "label": "I'm a label"
          }
        ]
      },
      {
        "name": "I'm a radio_button",
        "type": "radio_button",
        "id": "radio_button",
        "is_required": false,
        "options": [
          {
            "id": "1",
            "label": "I'm a label"
          },
          {
            "id": "2",
            "label": "I'm a label",
            "sub_label": "I'm a sub_label"
          }
        ]
      },
      {
        "name": "I'm a date",
        "type": "date",
        "id": "date",
        "is_required": false,
        "placeholder": "[placeholder]"
      },
      {
        "name": "I'm a datetime",
        "type": "datetime",
        "id": "datetime",
        "is_required": false,
        "placeholder": "[placeholder]"
      },
      {
        "name": "I'm a typeahead",
        "type": "typeahead",
        "id": "typeahead_half_width",
        "is_required": false,
        "typeahead_url": "https://localhost:8000/search/typeahead",
        "placeholder": "[half width]",
        "width": "half"
      },
      {
        "name": "I'm a typeahead",
        "type": "typeahead",
        "id": "typeahead_full_width",
        "is_required": false,
        "typeahead_url": "https://localhost:8000/search/typeahead",
        "placeholder": "[full width]",
        "width": "full"
      }
    ],
    "on_change_callback": "https://localhost:8000/form/onchange"
  }
}

typeahead_response = {
  "items": [
    {
      "title": "I'm a title",
      "subtitle": "I'm a subtitle",
      "value": "some_value",
      "icon_url": "https://placekitten.com/16/16",
    },
    {
      "title": "I'm a title",
      "subtitle": "I'm a subtitle",
      "value": "some_value",
      "icon_url": "https://placekitten.com/16/16",
    }
  ]
}

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app)
  .listen(port, function () {
    console.log(`Example app listening on port ${port}! Go to https://localhost:${port}/`)
  })