//Client Side JS for the chatroom
$(document).ready(function() {
    var socket = io();
    var input = $('#chat');
    var messages = $('#messages');
    var id = $('#id');
    var nav = $('#nav');
    var nav_ul = $('#nav ul');
    var rooms = $('#rooms');
    var chatter_name, roomID;

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
    var addName = function(name) {
//        console.log("print in addName name is "+name);       
        nav_ul.append('<li>' + name + '</li>');
    };
    var firstLoad = function(names) {
        for(i=0; i<names.length; i++){
            $('#nav ul').append('<li>' + names[i] + '</li>');}
    };
      var update = function(names) {
        $('#nav ul').remove();
        var u_list=$("#nav").append('<ul></ul>').find('ul');
//        console.log(names);
        for(i=0; i<names.length; i++){
            console.log('name to add ' + names[i]);
            u_list.append('<li>' + names[i] + '</li>');}
    };


    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var message = input.val();
        message = chatter_name.concat(': ',message);
        console.log(message);
        addMessage(message);
        socket.emit('message', message);
        input.val('');        
    });
//Block of Listeners handling every piece of data getting moved around
    socket.on('message', addMessage);
    socket.on('first_load', firstLoad);
    socket.on('nickname', addName);
    socket.on('list_update', update);

//Code to get the Nickname and set it on the page
    id.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var name = id.val();
        chatter_name=name
        nav_ul.append('<li>'+name+'</li>');
        var message = name+' Has Arrived!';
        socket.emit('message', message);
        socket.emit('nickname', name);
       id.replaceWith("<h1>"+name+" Is On! </h1>"); 
       input.show().emojiPicker();
       rooms.show();
    });          
//Room selecting stuff
$('li').on('click',function(){
    roomID = $(this).text();
    console.log('link clicked',roomID);
    socket.emit('chosenRoom',roomID);
    $('#nav h2').replaceWith( "<h2>"+roomID+"</h2>" );   
})


});

