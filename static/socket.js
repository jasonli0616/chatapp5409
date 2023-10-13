var socket = io();

socket.on("connect", () => {
    getMessages();
})


const displayAmountSelect = document.getElementById("displaylast");
let defaultDisplayAmount = 10;


function sendMessage() {
    let textInputElement = document.getElementById("messageinput");
    let message = textInputElement.value;

    textInputElement.value = ""
    socket.emit("send_message", {text: message});
}


socket.on("new_message", (data) => {
    populateMessages(data);
})


function getMessages() {
    socket.emit("get_messages");
}


function populateMessages(messagesRaw) {
    const messagesDiv = document.getElementById("displaymessages");
    let messages = JSON.parse(messagesRaw);

    // Clear div
    messagesDiv.innerHTML = "";

    let startingMessage = messages.length - getDisplayAmount(messages.length);

    // Insert messages
    for (let i = startingMessage; i < messages.length; i++) {
        let msg = messages[i];

        const msgElement = document.createElement("div");

        const author = document.createElement("h5");
        author.className = "card-title"
        author.textContent = msg.username;

        const datetime = document.createElement("h6");
        datetime.classList = "card-subtitle";
        datetime.textContent = new Date(msg.time * 1000).toLocaleString();

        const content = document.createElement("p");
        content.className = "card-text"
        content.textContent = msg.text;

        msgElement.appendChild(author);
        msgElement.appendChild(datetime);
        msgElement.appendChild(content);
        msgElement.appendChild(document.createElement("hr"))

        messagesDiv.appendChild(msgElement);

    }

    updateDisplayAmountOptions(messages.length);

}


function getDisplayAmount(max) {
    return Math.min(displayAmountSelect.value, max);
}


function updateDisplayAmountOptions(max) {

    // Clear existing
    displayAmountSelect.innerHTML = "";

    // Options 1, 5, 10, 20, max
    let options = [1, 5, 10, 20];
    if (max > 20)
        options.push(max);


    for (let option of options) {
        let element = document.createElement("option");
        element.value = option;
        element.textContent = option;
        displayAmountSelect.appendChild(element);
    }

    if (defaultDisplayAmount > 20)
        defaultDisplayAmount = max;
    displayAmountSelect.value = defaultDisplayAmount;
}


function updateDisplayAmount() {
    defaultDisplayAmount = displayAmountSelect.value;
    getMessages();
}


document.getElementById("sendmessageform")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage();
    })