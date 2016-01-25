//Client Side JS for the chatroom
$(document).ready(function() {
    var socket = io();
    var input = $('#chat');
    var messages = $('#messages');
    var id = $('#id');
    var nav = $('#nav');
    var nav_ul = $('#nav ul');
    var rooms = $('#rooms');
    var chatter_name, id_name, roomID;

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
    var addName = function(name) {
//        console.log("print in addName name added "+name);       
        nav_ul.append('<li>' + name + '</li>');
    };
    var firstLoad = function(names) {
        for(i=0; i<names.length; i++){
//            console.log('print in firstLoad name added'+names[i]);
            $('#nav ul').append('<li>' + names[i] + '</li>');}
    };
      var update = function(names) {
        $('#nav ul').remove();
        var u_list=$("#nav").append('<ul></ul>').find('ul');
//        console.log('print in update '+ names);
        for(i=0; i<names.length; i++){
            console.log('name to add ' + names[i]);
            u_list.append('<li>' + names[i] + '</li>');}
    };
    var locate = function(userRoom){
//        console.log('print in locate: '+userRoom.slice(-6));
        if(userRoom.slice(-6) === 'Room 1'){$("<li>"+userRoom+"</li>").insertBefore( '#r2' );}
        if(userRoom.slice(-6) === 'Room 2'){$("<li>"+userRoom+"</li>").insertBefore( '#r3' );}
        if(userRoom.slice(-6) === 'Room 3'){$("<li>"+userRoom+"</li>").insertAfter( '#r3' );}    
        
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
    socket.on('location', locate);

//Code to get the Nickname and set it on the page
    id.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var name = id.val();
        chatter_name=name;
        id_name=name;
        nav_ul.append('<li>'+name+'</li>');
        var message = name+' Has Arrived!';
        socket.emit('message', message);
        socket.emit('nickname', name);
       id.replaceWith("<h1>"+name+" Is On! </h1>"); 
       input.show().emojiPicker();
       rooms.show();
    });          
//Room selecting stuff

$('li #r1').on('click',pickRoom);
$('li #r2').on('click',pickRoom);
$('li #r3').on('click',pickRoom);

function pickRoom(){
//    roomID = '';
    roomID = $(this).text();
    console.log('link clicked',roomID);
    roomID=id_name+' is in '+roomID;
    socket.emit('chosenRoom',roomID);   
}



});

