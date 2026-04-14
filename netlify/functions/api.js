const serverless = require('serverless-http');

require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../build')));

const port = process.env.PORT || 3001;

app.get('/api/clarifai', (req, res) => {
    const value = req.query.image_url;
    const token = process.env.REACT_APP_TOKEN
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';
    // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": value
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + token
        },
        body: raw
    };

    if(value) {
        fetch(`https://api.clarifai.com/v2/models/`+MODEL_ID+`/versions/`+MODEL_VERSION_ID+`/outputs`, requestOptions)
        .then(response => response.json())
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log('error', error);
            alert("There was an error processing the image URL");
        });
    } else {
        alert("Please insert the URL of an image");
    }

});

app.post('/api/clarifai/upload', (req, res) => {
    const { image_base64 } = req.body;
    const token = process.env.REACT_APP_TOKEN;
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';

    if (!image_base64) {
        return res.status(400).json({ error: 'No image data provided' });
    }

    const raw = JSON.stringify({
        "user_app_id": { "user_id": "clarifai", "app_id": "main" },
        "inputs": [{ "data": { "image": { "base64": image_base64 } } }]
    });

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': 'Key ' + token },
        body: raw
    })
    .then(response => response.json())
    .then(result => res.json(result))
    .catch(error => {
        console.log('error', error);
        res.status(500).json({ error: 'Failed to process image' });
    });
});

app.get('/api/test', (req, res) => {
    res.send("Test is successful!");
});

app.listen(port, () => {
    console.log(`Express API listening at http://localhost:${port}`);
});

exports.handler = serverless(app);