const chatPage = document.getElementById("chat-page");
const namePage = document.getElementById("name-page");
const usernameField = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const connection = document.getElementById("connection");
const messageField = document.getElementById("message");
const chatBtn = document.getElementById("chatBtn");
const chatBody = document.getElementById("chat-body");
const user = document.getElementById("user");

let stopmClient = null;
let username = null;


let color = [
    "#22931a",
    "#03c472",
    "#099895",
    "#074e7c",
    "#0d0177",
    "#5e08a1",
    "#8303a6",
    "#bb04ad",
    "#bb0472",
    "#bb0435",
    "#050505",
    "#9a401a",
    "#9b3001",
    "#d07f06",
    "#7a4900",
    "#e7bc06",
    "#4b3c01",
    "#cbce00",
    "#798c00",
    "#515d11",
    "#adef29",
    "#6f9400",
    "#2d3f00",
    "#349841",
    "#3cff58",
    "#01520d",
    "#1d8c55",
    "#00733a",
    "#2da98c",
    "#005440",
    "#138a80",
    "#004f48",
    "#097991",
    "#00cffd",
    "#0f84c4",
    "#6b379b",
    "#a243ff",
    "#8825af",
    "#470065",
    "#dc10ac",
    "#9a225e"
];

function createElement(name, classArr, content) {
    let tag = document.createElement(name);
    classArr.forEach(cls => tag.classList.add(cls));
    tag.innerText = content.length !== 0 ? content : "";

    return tag;
}

function onMessageReceive(payload) {
    let body = JSON.parse(payload.body);

    if (body.type === "JOIN") {
        let pTag = createElement("p", ["alert", "alert-success", "mx-auto", "my-2", "w-50", "text-center"], body.sender + " has joined");
        chatBody.append(pTag);
    } else if (body.type === "CHAT") {
        let pTag = createElement("div", ["p-2", "card", "bg-light", "w-25", "mb-1"], "");

        let avatar = createElement("span", ["text-center", "d-flex", "justify-content-center", "align-items-center", "text-light", "me-2"],
            body.sender.charAt(0).toUpperCase());
        avatar.style.borderRadius = "50%";
        avatar.style.width = "40px";
        avatar.style.height = "40px";
        avatar.style.background = color[Math.ceil(Math.random() * (color.length - 1))];
        let nameSpan = createElement("h4", ["text-success"], "");

        let nameDiv = createElement("div", ["d-flex", "justify-content-start", "align-items-center"], "");
        nameDiv.append(avatar);
        nameDiv.append(nameSpan);

        let msgSpan = createElement("span", ["lead"], "");

        nameSpan.innerText = body.sender;
        msgSpan.innerText = body.message;

        pTag.append(nameDiv);
        pTag.append(msgSpan);


        chatBody.append(pTag);
    } else {
        let pTag = createElement("p", ["alert", "alert-danger", "mx-auto", "my-2", "w-50", "text-center"], body.sender + " has left")
        chatBody.append(pTag);
    }
}

function onConnect() {
    stopmClient.subscribe("/topic/public", onMessageReceive);

    stopmClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: "JOIN"}));
    connection.classList.add("d-none");
}

function onError() {
    connection.innerText = "Could not connect to Server";
    connection.classList.add("text-danger");
}

chatBtn.onclick = (e) => {
    e.preventDefault();
    let message = messageField.value.trim();
    if (message && stopmClient) {
        let req = {
            sender: username,
            message,
            type: 'CHAT'
        }

        stopmClient.send("/app/chat.sendMessage", {}, JSON.stringify(req));
        messageField.value = '';
    }
}

startBtn.onclick = (e) => {
    e.preventDefault();

    username = usernameField.value.trim();
    if (username) {
        namePage.classList.add("d-none");
        chatPage.classList.add("d-block");
        chatPage.classList.remove("d-none");
        user.innerText = username;

        let socket = new SockJS("/ws");
        stopmClient = Stomp.over(socket);
        stopmClient.connect({}, onConnect, onError);
    }

}

