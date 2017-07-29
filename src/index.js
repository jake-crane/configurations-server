var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var data = require('../configurations.json');

router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.get('/', (req, res) => {
    res.send(data);
});

router.post('/', (req, res) => {
    data.configuration.push(req.body);
    res.status(204).send();
});

router.put('/:id', (req, res) => {
    const index = data.configuration.findIndex(
        (configuration) => configuration.id === req.params.id
    );
    data.configuration[index] = req.body;
    res.status(204).send();
});

router.delete('/:id', (req, res) => {
    const index = data.configuration.findIndex(
        (configuration) => configuration.id === req.params.id
    );
    data.configuration.splice(index, 1);
    res.status(204).send();
});

app.use(bodyParser.json());
app.use('/configurations', router);

app.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});