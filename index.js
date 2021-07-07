const express = require('express')
const https = require('https')
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const app = express()
const port = 8000

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/auth', (req, res) => {
  console.log("Auth Happened!")

  res.sendFile(path.join(__dirname, '/auth.html'));
})

app.get('/widget', (req, res) => {
  console.log("Widget Happened!")

  result = {
      "metadata": {
        "comment_count": 2,
        "fields": [
          {
            "color": "gray",
            "icon_url": "https://example-icon.png",
            "name": "Status",
            "text": "To Do",
            "type": "pill"
          }
        ],
        "footer": "Last updated 19 hours ago",
        "subtitle": "Custom App Story · Open in Custom App",
        "title": "Status"
      },
      "template": "summary_with_details_v0"
    }
  res.json(result)
})

app.get('/form/metadata', (req, res) => {
  console.log("Form Happened!")

  result = {
      "fields": [
        {
          "id": "item-description",
          "options": [
            {
              "icon_url": "some-icon.png",
              "id": "opt-in",
              "label": "Opt in to emails."
            }
          ],
          "placeholder": "I'm a placeholder...",
          "required": true,
          "title": "Text Example",
          "type": "single_line_text",
          "width": "full"
        },
        {
          "id": "pre-filled-description",
          "options": [
            {
              "icon_url": "some-icon.png",
              "id": "opt-in",
              "label": "Opt in to emails."
            }
          ],
          "placeholder": "Type stuff here...",
          "required": true,
          "title": "Prefilled Example",
          "type": "single_line_text",
          "value": "I'm prefilled text!",
          "width": "full"
        }
      ],
      "on_submit_callback": "https://localhost:8000/form/submit",
      "submit_button_text": "Submit Form",
      "title": "I'm a Form"
    }

  res.json(result)
})

app.post('/form/submit', (req, res) => {
  console.log("Modal Submitted!")

  result = {
    "resource_name": "I'm a Widget",
    "resource_url": "https://localhost:8000"
  }

  res.json(result)
})

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app)
.listen(port, function () {
  console.log(`Example app listening on port ${port}! Go to https://localhost:${port}/`)
})