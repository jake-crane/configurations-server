const express = require('express');
const bodyParser = require('body-parser');
const fakeCsrf = require('./fake-csrf');
const jsonValidator = require('./json-validator');
const data = require('../configurations.json');
const app = express();
const router = express.Router();

app.use(bodyParser.json());

app.use(fakeCsrf);

router.post('/', jsonValidator);
router.put('/:id', jsonValidator);

app.use('/configurations', router);
app.use((err, req, res, next) => {
	res.status(err.status || 500).send(err.message);
});

const listener = app.listen(8000, () => {
	console.log('Server running at http://localhost:' + listener.address().port);
});

router.get('/', (req, res) => {
	const resp = JSON.parse(JSON.stringify(data));
	for (const config of resp.configuration)
		if (config.type === 'ENC_PASSWORD')
			config.value = '!@#$%^&*';
	res.send(resp);
});

router.post('/', (req, res) => {
	const newConfiguration = req.body;
	newConfiguration.id = Math.floor(Math.random() * 1000000) + 1;
	data.configuration.push(newConfiguration);
	res.status(200).send(newConfiguration);
});

router.put('/:id', (req, res) => {
	const index = data.configuration.findIndex(
		configuration => configuration.id == req.params.id
	);
	if (index === -1 || req.params.id != req.body.id) {
		res.status(400).send('Invalid id or ids do not match');
		return;
	}
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