var express = require('express');
var router = express.Router();
var EditorModel = require('./../models/editor-model')
var WssModel = require('./../models/wss-model');
const config = require('config')
const WebSocket = require('ws')

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/editor', function (req, res, next) {
    try {
        res.send({
            text: EditorModel.getText()
        })
    } catch (err) {
        next(err)
    }
});

router.post('/editor', function (req, res, next) {
    try {
        EditorModel.setText(req.body.text)
        WssModel.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(req.body.text);
            }
        });
        res.send('success')
    } catch (err) {
        next(err)
    }
});

module.exports = router;
