const http = require('http');

const PORT = 3000;
const RESPONSE_SIZE_MB = 15;

const server = http.createServer((req, res) => {
    // CORS headers to allow requests from the extension
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    console.log(`Received request from ${req.url}`);

    // Generate a large string
    // 15MB of data
    const largeString = 'x'.repeat(RESPONSE_SIZE_MB * 1024 * 1024);
    const data = {
        message: "This is a large response to test performance",
        size: `${RESPONSE_SIZE_MB} MB`,
        data: largeString
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    console.log(`Sent ${RESPONSE_SIZE_MB}MB response`);
});

server.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    console.log(`It will return a ~${RESPONSE_SIZE_MB}MB JSON response`);
});
