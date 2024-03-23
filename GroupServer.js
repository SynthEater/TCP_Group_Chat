// Use nodejs 'Net' module
const net = require('node:net');

// Use nodejs 'Prompt-Sync' module
const prompt = require('prompt-sync')({ sigint: true });

const clients = [];

// Creation of the server
const server = net.createServer(socket => {

    clients.push(socket);

    // Listen for the 'data' event when data is received from the client
    socket.on('data', data => {

        if(socket.dataNb > 0){

            console.log('(' + socket.username + '): ' + data.toString().trim());

            for(let i = 0; i < clients.length ; i++){

                clients[i].write('          (' + socket.username + '): ' + data.toString().trim());
                clients[i].write('\n')
            }
        }

        if (socket.dataNb === 0 && data.toString().trim() !== 'ip') {
            socket.username = data.toString().trim();
            socket.dataNb++;

        } else if(socket.dataNb === 0 && data.toString().trim() === 'ip') { 
            socket.username = socket.clientIp;
            socket.dataNb++;
                  
        }
    });

    // Show that a client has disconnected (+ their ip)
    socket.on('end', () => {
        console.log('CLIENT DISCONNECTED (' + socket.username + ')');

        for(let j = 0; j < clients.length ; j++){
                
            clients[j].write('CLIENT DISCONNECTED (' + socket.username + ')');
            clients[j].write('\n')
        }

        //remove disconnected clients from clients array
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });

    // On fail, send error message to client and print error in server's terminal
    socket.on('error', (err) => {
        if(err.code !== 'EPIPE'){
            console.error('ERROR', err);
        }
        socket.write('ERROR');
    });
});

// Listen for the 'connection' event when a new connection is established
server.on('connection', socket => {
    // Store the client's IP address within the socket object
    socket.clientIp = socket.remoteAddress;
    // Initialize dataNb for the current client
    socket.dataNb = 0;
    console.log('CLIENT CONNECTED (' + socket.clientIp + ')');

    for(let k = 0 ; k < clients.length ; k++){
        clients[k].write('CLIENT CONNECTED (' + socket.clientIp + ')');
        clients[k].write('\n');
    }


    // Send initial messages to the client
    socket.write('\n-Welcome to TCP Server!\n\n');
    socket.write('-The first message you send will be your username\nIf you want to display your ip instead, type "ip"\n\n');
});

// Accept all IP addresses on port 1647
const HOST = '0.0.0.0';
const PORT = 1647;
server.listen(PORT, HOST, () => {
    console.log(`${HOST} : ${PORT}`);
});

