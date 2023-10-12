var socket = io();

var messages = {}


function sendMessage() {
    let message = document.getElementById("messageinput").value;
    socket.emit("send_message", {text: message});
}

socket.on("new_message", (data) => {
    console.log(data);
})
