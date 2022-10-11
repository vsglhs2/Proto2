import { createMessage } from "./message.js";

window.addEventListener("load", function() {
    const exitButton = document.querySelector("#exitButton");
    exitButton.addEventListener("click", () => {
        createMessage("Вы уверены, что хотите выйти из аккаунта?", "dialog", [{controlType: "agree", callback: () => {
            localStorage.setItem("userId", -1);
            location.reload();            
        }}, {controlType: "disagree"}]);

    });

    const addAudios = document.querySelector("#addAudios");
    addAudios.addEventListener("click", () => {
        createMessage("Эта функция временно недоступна!", "info", [], null, 5000);
    });

    const scanProcess = document.querySelector("#scanProcess");
    scanProcess.addEventListener("click", () => {
        createMessage("Эта функция временно недоступна!", "info", [], null, 5000);
    });

    const scanResults = document.querySelector("#scanResults");
    scanResults.addEventListener("click", () => {
        createMessage("Эта функция временно недоступна!", "info", [], null, 5000);
    });
});