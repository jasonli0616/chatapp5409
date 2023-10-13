var socket = io();

socket.on("connect", () => {
    getMessages();
})


// Dropdown to select how many messages to display.
const displayAmountSelect = document.getElementById("displaylast");
let defaultDisplayAmount = 10;


/**
 * Handles sending a message.
 * 
 * Takes input and emits event to backend.
 */
function sendMessage() {
    let textInputElement = document.getElementById("messageinput");
    let message = textInputElement.value;

    if (message) {
        textInputElement.value = ""
        socket.emit("send_message", {text: message});
    }
}


/**
 * Listens for broadcasted messages, and populates.
 */
socket.on("new_message", (data) => {
    populateMessages(data);
})


/**
 * Emit event to get messages.
 */
function getMessages() {
    socket.emit("get_messages");
}


/**
 * Populate the messages section.
 * 
 * @param {*} messagesRaw raw JSON string of messages
 */
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


/**
 * Returns the lowest value out of [selected, max].
 * 
 * @param {*} max number of messages
 * @returns amount of messages to display
 */
function getDisplayAmount(max) {
    return Math.min(displayAmountSelect.value, max);
}


/**
 * Updates the display amount options with the total number of messages.
 * 
 * @param {*} max 
 */
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


/**
 * Listens to user changing display amount, and updates.
 */
document.getElementById("displaylast").addEventListener("change", () => {
    defaultDisplayAmount = displayAmountSelect.value;
    getMessages();
})


/**
 * Handle message send, and prevents refresh.
 */
document.getElementById("sendmessageform")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage();
    })