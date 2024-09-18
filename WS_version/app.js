const { exec } = require('child_process');
const open = require('open');
const net = require('net');

const PORT = 1647;

// Function to check if a port is in use
function isPortInUse(port, callback) {
    const server = net.createServer();

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            callback(true);
        } else {
            callback(false);
        }
    });

    server.once('listening', () => {
        server.close();
        callback(false);
    });

    server.listen(port);
}

// Start the WebSocket server if the port is available
isPortInUse(PORT, (inUse) => {
    if (!inUse) {
        console.log(`Port ${PORT} is available, starting WebSocket server...`);
        const startServer = exec('npm start');

        startServer.stdout.on('data', (data) => {
            console.log(`Server Output: ${data}`);
        });

        startServer.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        startServer.on('exit', (code) => {
            if (code !== 0) {
                console.error(`WebSocket server exited with code ${code}`);
                process.exit(code);  // Stop the process if the WebSocket server fails
            } else {
                // Start the frontend server only if the WebSocket server started successfully
                const startFrontend = exec('npm run start-frontend');

                startFrontend.stdout.on('data', (data) => {
                    console.log(`Frontend Output: ${data}`);
                });

                startFrontend.stderr.on('data', (data) => {
                    console.error(`Frontend Error: ${data}`);
                });

                startFrontend.on('exit', () => {
                    open('http://localhost:3000');
                });
            }
        });
    } else {
        console.error(`Port ${PORT} is already in use. Please free the port and try again.`);
        process.exit(1);
    }
});