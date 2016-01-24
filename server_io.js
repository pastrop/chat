var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var count = 0; // user count
var active_clients = []; // array of socket_ids
var nicknames = [];  //list of user nicknames
var rooms = ['room1', 'room2', 'room3']; // available rooms
 

io.on('connection', function (socket) {
    count++;

    active_clients.push(socket.id); // add socket into array of socket ids on connect
    console.log('Client connected, total in the room: '+ count);
    console.log('New client socket.id '+ active_clients[count-1]);
    socket.broadcast.emit('message', 'new client entered the room'); //client connect

    io.to(socket.id).emit('first_load', nicknames); //seeding up the list of chatters at connect
//On getting nickname from client, broadcast a bunch of stuff & update the list of chatters
    socket.on('nickname', function(name) {
        console.log('Received name:', name);
        nicknames.push(name);
        socket.broadcast.emit('nickname', name);
        socket.broadcast.emit('list_update', nicknames);
	    });
//Room Selector
    socket.on('chosenRoom', function(roomID){
        console.log('room selected: ',roomID," by user: ",socket.id);
//        if(roomID){socket.leave(roomID);}
        socket.join(roomID);
//sending message to a particular room        
        socket.on('message', function(message) {
        socket.broadcast.to(roomID).emit('message', message);
        }); 
    });    
    
// Messages broadcast (this one goes to everyone)
//    socket.on('message', function(message) {
//        socket.broadcast.emit('message', message);
//	    });    
// Handling disconnect
	socket.on('disconnect', function(){
	console.log('disconnected '+ socket.id);
	
    for(i=0; i<active_clients.length; i++){
        if(active_clients[i]==socket.id){
            var exitmessage=nicknames[i]+' just bagged out'
            socket.broadcast.emit('message', exitmessage);    
            console.log('Why did you leave us '+nicknames[i]+' counter# '+i);
            nicknames.splice(i,1);
            active_clients.splice(i,1);
            console.log('nicknames array afer splice method:' + nicknames);
            socket.broadcast.emit('list_update', nicknames);
            break;
        }
    }

	count--;
	console.log('total in the room: ', count);
	
	});    
});
server.listen(8080);