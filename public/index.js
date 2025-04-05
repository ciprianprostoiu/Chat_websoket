const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const input_nome = document.getElementById("input_nome");
const button_nome = document.getElementById("sendButton_nome");
const output = document.getElementById("output");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];
const socket = io();

button_nome.onclick = () => {
    if(input_nome.value==""){
        console.log("non valido")
    }
    else{
        socket.emit("connessione", input_nome.value)
        input_nome.classList.add("hidden");
        input_nome.classList.remove("visible");
        button_nome.classList.add("hidden");
        button_nome.classList.remove("visible");
        input.classList.add("visible");
        input.classList.remove("hidden");
        button.classList.add("visible");
        button.classList.remove("hidden");
        chat.classList.add("visible");
        chat.classList.remove("hidden");
    }
}

input.onkeydown = (event) => {
  
  if (event.keyCode === 13) {
      event.preventDefault();
      button.click();
  }
}

button.onclick = () => {
  socket.emit("message", input.value);
  input.value = "";
}

socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  render();
})

socket.on("render_user", (message) => {
    console.log(message);
    render_2(message)
  })

const render = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html+=row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
}


const render_2 = (message) =>{
    let html = "User: \n";
    message.forEach((mess) => {
        const row = template.replace("%MESSAGE", mess);
        html+=row;
      });
      output.innerHTML = html;
}