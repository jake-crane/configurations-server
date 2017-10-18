module.exports = (req, res, next) => {
	const validKeys = ['id', 'key', 'name', 'value', 'description', 'type'];
	const keys = Object.keys(req.body);
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
	next();
};