var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var data = require('../configurations.json');

const token = Math.floor(Math.random() * 1000000) + 1;

router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    if (req.method === 'GET' || req.headers['csrf_token'] == token)
        next();
    else {
        res.status(401).send('Invalid CSRF Token');
    }
});

router.get('/', (req, res) => {
    res.setHeader('CSRF_TOKEN', token);
    res.send(data);
});

router.post('/', (req, res) => {
    var newConfiguration = req.body;
     if (Object.keys(newConfiguration).length !== 6)
         res.status(400).send('Invalid property in data');
    newConfiguration.id = Math.floor(Math.random() * 1000000) + 1;
    data.configuration.push(newConfiguration);
    res.status(200).send(newConfiguration);
});

router.put('/:id', (req, res) => {
    const index = data.configuration.findIndex(
        configuration => configuration.id == req.params.id
    );
    if (index === -1 || req.params.id != req.body.id)
        res.status(400).send('Invalid id or ids do not match');
    else if (Object.keys(req.body).length !== 6)
        res.status(400).send('Invalid property in data');
    data.configuration[index] = req.body;
    res.status(204).send();
});

router.delete('/:id', (req, res) => {
    const index = data.configuration.findIndex(
        (configuration) => configuration.id == req.params.id
    );
    if (index === -1)
        res.status(400).send('Invalid id');
    data.configuration.splice(index, 1);
    res.status(204).send();
});

app.use(bodyParser.json());
app.use('/configurations', router);

app.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});