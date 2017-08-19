import http from 'http';
import app from './server';

const server = http.createServer(app);
let currentApp = app;

var listener = app.listen(8000, () => {
    console.log('Server running at http://localhost:' + listener.address().port);
});

if (module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;
    });
}