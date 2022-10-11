import { createMessage } from "./message.js";

window.addEventListener("load", function() {
    document.querySelector("#loginButton").addEventListener("click", e => {
        location.replace(`https://oauth.yandex.ru/authorize?response_type=token&client_id=75e43b71ee31460296fd35738a46991b`);
    });
/*
    let promise  = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
    }, 3000);
     });
    let text = "Для доступа на страницу сначала необходимо войти в аккаунт",
significance = "critical";
    createMessage(text, significance, 
        [
            {
                controlType: "agree", 
                callback: () => console.log("agree")
            },
            {
                controlType: "disagree",
                callback: () => console.log("disagree")
            }

        ]
    );
    createMessage(text, "warning");
    createMessage(text, "info");
    createMessage(text, "waiting", [{controlType: "close"}], promise);*/


    
    let params = new URL(window.location).hash;
    if (params) {
        let token = /access_token=([^&]+)/.exec(document.location.hash)[1];
        this.localStorage.setItem("userId", token);

        location.replace("index.html");
    }
});