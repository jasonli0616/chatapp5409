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

        const author = document.createElement("h5");
        author.className = "card-title"
        author.textContent = msg.username;

        const datetime = document.createElement("h6");
        datetime.classList = "card-subtitle";
        datetime.textContent = msg.time;

        const content = document.createElement("p");
        content.className = "card-text"
        content.textContent = msg.text;

        msgElement.appendChild(author);
        msgElement.appendChild(datetime);
        msgElement.appendChild(content);
        msgElement.appendChild(document.createElement("hr"))

        messagesDiv.appendChild(msgElement);

    }

}