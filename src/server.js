var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
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
	var resp = JSON.parse(JSON.stringify(data));
	for (var config of resp.configuration)
		if (config.type === 'ENC_PASSWORD')
			config.value = '!@#$%^&*';
	res.send(resp);
});

function validateConfiguration(config) {
	var validKeys = ['id', 'key', 'name', 'value', 'description', 'type'];
	var keys = Object.keys(config);
	for (var key of keys) {
		if (!validKeys.includes(key)) {
			var errorMessage = `Invalid property "${key}" in configuration`;
			console.error(errorMessage);
			throw {
				message: errorMessage,
				status: 400
			};
		}
	}
}

function getConfigFromReq(req) {
	var config = req.body;
	validateConfiguration(config);
	return config;
}

router.post('/', (req, res) => {
	var newConfiguration = getConfigFromReq(req);
	newConfiguration.id = Math.floor(Math.random() * 1000000) + 1;
	data.configuration.push(newConfiguration);
	res.status(200).send(newConfiguration);
});

router.put('/:id', (req, res) => {
	var config = getConfigFromReq(req);
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
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true 
}));
app.use('/configurations', router);
app.use(function (err, req, res, next) {
	res.status(err.status || 500).send(err.message);
});

var listener = app.listen(8000, () => {
	console.log('Server running at http://localhost:' + listener.address().port);
});