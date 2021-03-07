const express = require('express');

const app = express();

app.use(express.static('./dist/agGrid'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/agGrid/'}),
);

app.listen(process.env.PORT || 8080);