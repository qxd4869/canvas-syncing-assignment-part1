/** get the HTTP module and create a server.
   This time we will store the returned server as "app"* */
const http = require('http');

const socketio = require('socket.io');

const fs = require('fs'); // grab our file system

let score = 0;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    // if err, throw it for now
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
};

// create a new http server
const app = http.createServer(handler);

// tell server to listen on the port
app.listen(3000);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room1');


  socket.on('updateScore', (data) => {
    /** add to our score
      This is normally where we would do error checking and
      validation to prevent malicious or cheated values * */
    score += data;

    /** Emit the new total server score out to all of our
       clients in the room * */
    io.sockets.in('room1').emit('updated', score);
  });

  /** When someone disconnects, remove their websocket from
     the socket room * */
  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log('listening on port 3000');
