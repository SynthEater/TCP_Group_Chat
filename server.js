let clients = [];

// Use nodejs 'Net' module
const net = require('node:net');

// Creation of the server
const server = net.createServer(socket => {

    //on connection, store each socket in 'clients' array
    clients.push(socket);
    
    //Show that a client has connected(+ his ip)
    console.log('CLIENT CONNECTED (' + socket.remoteAddress + ')');

    //print socket object of client (debug)
    //console.log(socket);

    //Send hello back to client on socket
    socket.write('\nWelcome to TCP Server!\n');

    //Create a 'prompt' for client
    socket.write('$:');

    //Print data received from client
    socket.on('data', data => {
        console.log(' client(' + socket.remoteAddress + '): ' + data.toString());
        socket.write('message: ' + data.toString() + ' recu');
    })

    //Show that a client has disconnected(+ his ip)
    socket.on('end', () => {
        console.log('CLIENT DISCONNECTED ('+ socket.remoteAddress + ')');
    })

    socket.on('error', () => {
        console.log('AN ERROR MADE THE SERVER SHUT DOWN!');
        socket.write('AN ERROR MADE THE SERVER SHUT DOWN!');
    })
})


//accept all ip addresses on port 1647
const HOST = '0.0.0.0';
const PORT = 1647;
server.listen(PORT, HOST, () => {
    console.log(`${HOST} : ${PORT}`);
})
