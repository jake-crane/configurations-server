const token = Math.floor(Math.random() * 1000000) + 1;

module.exports = (req, res, next) => {
	if (req.method === 'GET') {
		res.setHeader('CSRF_TOKEN', token);
		next();
	} else if (req.headers['csrf_token'] == token) {
		next();
	} else {
		res.status(401).send('Invalid CSRF Token');
	}
};