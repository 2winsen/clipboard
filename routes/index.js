var express = require('express');
var router = express.Router();
var EditorModel = require('./../models/editor-model');

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/editor', function (req, res, next) {
    try {
        res.send(EditorModel.getText());
    } catch (err) {
        next(err)
    }    
});

router.post('/editor', function (req, res, next) {
    try {
        EditorModel.setText(req.body.text)
        res.send('success')
    } catch (err) {
        next(err)
    }
});

module.exports = router;
