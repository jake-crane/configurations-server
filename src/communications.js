const fs = require('fs');
const express = require('express');
const router = express.Router();
const xmlResponses = {};


function setupGetRoute(name) {
    fs.readFile(`./communications/${name}.xml`, 'utf8', (err, data) => {
        router.get(`/${name}`, (req, res) => {
            res.set('Content-Type', 'text/xml');
            xmlResponses[name] = data;
            res.send(xmlResponses[name]);
        });
    });
}

setupGetRoute('aftsettings');
setupGetRoute('clients');
setupGetRoute('contentmanagement');
setupGetRoute('deliverychannels');
setupGetRoute('ftpsettings');
setupGetRoute('systemsecurity');

router.put('/aftsettings', (req, res) => {
    res.status(200).send(xmlResponses['aftsettings']);
});

router.put('/clients/:id', (req, res) => {
    res.status(200).send(xmlResponses['clients']);
});

router.put('/contentmanagement', (req, res) => {
    res.status(200).send(xmlResponses['contentmanagement']);
});

router.put('/deliverychannels', (req, res) => {
    res.status(200).send(xmlResponses['deliverychannels']);
});

router.post('/ftpsettings', (req, res) => {
    res.status(200).send(xmlResponses['ftpsettings']);
});

router.put('/systemsecurity', (req, res) => {
    res.status(200).send(xmlResponses['systemsecurity']);
});


module.exports = router;