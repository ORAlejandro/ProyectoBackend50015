const socket = io(); 
let user; 
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Bienvenido/a, ¿Cómo debemos llamarte?", 
    inputValidator: (value) => {
        return !value && "No podes acceder al chat sin un nombre"
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

//Listener de Mensajes: 

socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `${message.user}: ${message.message} <br>`
    })

    log.innerHTML = messages;
});