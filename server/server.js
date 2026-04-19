// server.js
const http = require('http');
const app = require('./routes'); // Import your app.js

const server = http.createServer(app);

server.listen(3225, () => {
    console.log('Server is running on http://localhost:3225');
});