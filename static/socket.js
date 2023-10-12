var socket = io();

var messages = {}


function sendMessage() {
    let message = document.getElementById("messageinput").value;
    socket.emit("send_message", {text: message});
}


socket.on("new_message", (data) => {
    populateMessages(data);
})


function populateMessages(messagesRaw) {
    const messagesDiv = document.getElementById("displaymessages");
    let existing = messagesDiv.childElementCount;
    let messages = JSON.parse(messagesRaw);

    // Insert messages
    for (let i = existing; i < messages.length; i++) {
        let msg = messages[i];
        console.log(msg);

        const msgElement = document.createElement("div");
        msgElement.className = "message";

        const content = document.createElement("p");
        content.textContent = msg.text;

        const author = document.createElement("h2");
        author.textContent = `${msg.username} at ${msg.time}`;

        messagesDiv.appendChild(content);
        messagesDiv.appendChild(author);

        messagesDiv.appendChild(msgElement);

    }

}