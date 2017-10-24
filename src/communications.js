const fs = require('fs');
const express = require('express');
const router = express.Router();

function setupRoute(name) {
    fs.readFile(`./communications/${name}.xml`, 'utf8', (err, data) => {
        router.get(`/${name}`, (req, res) => {
            res.set('Content-Type', 'text/xml');
            res.send(data);
        });
    });
}

setupRoute('aftsettings');
setupRoute('clients');
setupRoute('contentmanagement');
setupRoute('deliverychannels');
setupRoute('ftpsettings');
setupRoute('systemsecurity');

module.exports = router;