const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const data = require('../configurations.json');
const fakeCsrf = require('./fake-csrf');


router.get('/', (req, res) => {
	const resp = JSON.parse(JSON.stringify(data));
	for (const config of resp.configuration)
		if (config.type === 'ENC_PASSWORD')
			config.value = '!@#$%^&*';
	res.send(resp);
});

function validateConfiguration(config) {
	const validKeys = ['id', 'key', 'name', 'value', 'description', 'type'];
	const keys = Object.keys(config);
	for (const key of keys) {
		if (!validKeys.includes(key)) {
			const errorMessage = `Invalid property "${key}" in configuration`;
			console.error(errorMessage);
			throw {
				message: errorMessage,
				status: 400
			};
		}
	}
}

function getConfigFromReq(req) {
	const config = req.body;
	validateConfiguration(config);
	return config;
}

router.post('/', (req, res) => {
	const newConfiguration = getConfigFromReq(req);
	newConfiguration.id = Math.floor(Math.random() * 1000000) + 1;
	data.configuration.push(newConfiguration);
	res.status(200).send(newConfiguration);
});

router.put('/:id', (req, res) => {
	const config = getConfigFromReq(req);
	const index = data.configuration.findIndex(
		configuration => configuration.id == req.params.id
	);
	if (index === -1 || req.params.id != config.id) {
		res.status(400).send('Invalid id or ids do not match');
		return;
	}
	data.configuration[index] = config;
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
app.use(cookieParser());
app.use(session({
	name: 'JSESSIONID',
	secret: 'Shh, its a secret!',
	resave: true,
	saveUninitialized: true
}));
app.use(fakeCsrf);
app.use('/configurations', router);
app.use(function (err, req, res, next) {
	res.status(err.status || 500).send(err.message);
});

const listener = app.listen(8000, () => {
	console.log('Server running at http://localhost:' + listener.address().port);
});