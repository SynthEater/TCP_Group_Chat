const WebSocket = require('ws');

// Store connected clients
const clients = [];

// Create the WebSocket server
const wss = new WebSocket.Server({ port: 1647 });

wss.on('connection', (ws, req) => {
    // Store each connected client
    clients.push(ws);

    // Store the client's IP address and initialize dataNb
    ws.clientIp = req.socket.remoteAddress;
    ws.dataNb = 0;

    console.log('CLIENT CONNECTED (' + ws.clientIp + ')');

    // Notify all clients about the new connection
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('CLIENT CONNECTED (' + ws.clientIp + ')');
        }
    });

    // Send initial messages to the new client
    ws.send('\n-Welcome to WebSocket Server!\n\n');
    ws.send('-The first message you send will be your username\nIf you want to display your IP instead, type "ip"\n\n');

    // Listen for messages from the client
    ws.on('message', message => {
        const data = message.toString().trim();

        if (ws.dataNb > 0) {
            console.log('(' + ws.username + '): ' + data);

            // Broadcast the message to all clients
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('          (' + ws.username + '): ' + data);
                }
            });
        }

        if (ws.dataNb === 0 && data !== 'ip') {
            ws.username = data;
            ws.dataNb++;
        } else if (ws.dataNb === 0 && data === 'ip') {
            ws.username = ws.clientIp;
            ws.dataNb++;
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('CLIENT DISCONNECTED (' + ws.username + ')');

        // Notify all clients about the disconnection
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('CLIENT DISCONNECTED (' + ws.username + ')');
            }
        });

        // Remove the disconnected client from the list
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });

    // Handle errors
    ws.on('error', err => {
        console.error('ERROR', err);
        ws.send('ERROR');
    });
});

console.log('WebSocket server is listening on ws://0.0.0.0:1647');