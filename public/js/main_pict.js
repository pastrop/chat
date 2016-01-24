var pictionary = function() {
    var canvas, context;
    var socket = io();
    var drawing;
    var flag;
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

        var setFlag = function(count) {
        flag=count;
        console.log(flag);
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;


    canvas.on('mousemove', function(event) {        
       canvas.on('mouseup',function(){
        drawing = false;
//        console.log("drawing  " + drawing);
       }); 
       canvas.on('mousedown',function(){
        drawing = true;
//        console.log("drawing  " + drawing);
       });

        if(drawing && flag === 1){
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        
            draw(position);

            socket.emit('draw', position);}

    });  //mousemove function ends
socket.on('drawer', setFlag); 
socket.on('drawer_left', setFlag); 
socket.on('draw', draw);   

    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

//       console.log(guessBox.val());
        var data=guessBox.val();  // stuff from the guessing box on the site
        console.log(data);
        addData(data);
        socket.emit('guess', data)
        guessBox.val('');
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

        var addData = function(stuff) {
        $('#guess').append('<div>' + stuff + '</div>');
        };

};//pictionary ends

$(document).ready(function() {

    pictionary();
    
});