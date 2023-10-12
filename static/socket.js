var socket = io();

socket.on("connect", () => {
    socket.emit("get_messages")
})


function sendMessage() {
    let textInputElement = document.getElementById("messageinput");
    let message = textInputElement.value;

    textInputElement.value = ""
    socket.emit("send_message", {text: message});
}


socket.on("new_message", (data) => {
    populateMessages(data);
})


function populateMessages(messagesRaw) {
    const messagesDiv = document.getElementById("displaymessages");
    let messages = JSON.parse(messagesRaw);

    // Clear div
    messagesDiv.innerText = "";

    // Insert 10 latest messages
    for (let i = messages.length - 10; i < messages.length; i++) {
        let msg = messages[i];
        console.log(msg);

        const msgElement = document.createElement("div");
        msgElement.className = "message";

        const content = document.createElement("p");
        content.textContent = msg.text;

        const author = document.createElement("h2");
        author.textContent = `${msg.username} at ${msg.time}`;

        msgElement.appendChild(author);
        msgElement.appendChild(content);

        messagesDiv.appendChild(msgElement);

    }

}