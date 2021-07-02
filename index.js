const express = require('express')
const path = require('path');
const app = express()
const port = 8000

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
        "data": {
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

app.get('/modal/metadata', (req, res) => {
    console.log("Modal Happened!")

    result = {
        "error": "You must provide either a name or a title",
        "fields": [
          {
            "error": "Maximum description length is 256 characters",
            "id": "item-description",
            "options": [
              {
                "icon_url": "some-icon.png",
                "id": "opt-in",
                "label": "Opt in to emails."
              }
            ],
            "placeholder": "Type description here...",
            "required": true,
            "title": "Item Description",
            "type": "single_line_text",
            "value": "It's over 9000",
            "width": "full"
          }
        ],
        "on_submit_callback": "www.example.com/on_submit",
        "submit_button_text": "Create New Issue",
        "title": "Create New Issue"
      }
    
    res.json(result)
})

app.post('/modal/submit', (req, res) => {
  console.log("Modal Submitted!")
  
  console.log(req.json)

  res.status(200).send()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})