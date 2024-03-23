// Use nodejs 'Net' module
const net = require('node:net');

// Use nodejs 'Prompt-Sync' module
const prompt = require('prompt-sync')({ sigint: true});

// Creation of the server
const server = net.createServer(socket => {

    let dataNb = 0;
    let username;
    
    //Show that a client has connected(+ his ip)
    console.log('CLIENT CONNECTED (' + socket.remoteAddress + ')');

    //Send hello back to client on socket
    socket.write('\n-Welcome to TCP Server!\n\n');


    //see gpt code for 'connection event'


    socket.write('-The first message you send will be your username\nIf you want to display your ip instead, type "ip"\n\n');

    //Print data received from client
    socket.on('data', data => {
        if(dataNb == 0 && data.toString() !== 'ip'){
            username = data.toString().trim();
            dataNb++;
        } else {    
            if(data.toString().trim() === 'ip'){
                console.log(' client(' + socket.remoteAddress + '): ' + data.toString());
                dataNb++;
            } else {
                console.log('from: ' + username + ': ' + data.toString());
                dataNb++;
            }
        }
    })

    //Show that a client has disconnected(+ his ip)
    socket.on('end', () => {
        console.log('CLIENT DISCONNECTED ('+ socket.remoteAddress + ')');
    })

    //On fail, send error message to client and print error in server's terminal
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

// Function to send a message to a specific client
//Use array index of the client you want to talk to in 'clients' array (use j1-4 variables ex: sendToClient(j1, 'alloTest'))
function sendToClient(clientSocket, message) {
    clientSocket.write(message);
}