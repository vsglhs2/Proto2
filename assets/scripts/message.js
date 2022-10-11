const Controls = {
    close: {
        name: "clear.svg",
        class: "close",
        color: ""
    },
    agree: {
        name: "check.svg",
        class: "agree",
        color: ""
    },
    disagree: {
        name: "clear.svg",
        class: "disagree",
        color: ""
    }
};

export function createMessage(text, significance = "info", controls = [], waitingPromise = null, delay = 0) {
    let messageWrapper = document.querySelector(".message-wrapper");
    let icon = {
        color: null,
        name: null
    }

    switch (significance) {
        case "critical": icon.class = "red"; icon.name = "delete.svg"; break;
        case "warning": icon.class = "yellow"; icon.name = "contact.svg"; break;
        case "info": icon.class = "blue"; icon.name = "help.svg"; break;
        case "waiting": icon.class = "blue", icon.name = "settings.svg"; break;
        case "dialog": icon.class = "green", icon.name = "help.svg"; break;
    }

    if (controls.length == 0) {
        controls.push({
            controlType: "close",
        })
    }

    controls.forEach(element => {

        element = Object.assign(element, Controls[element.controlType]);
        let elemClass = element.class;
        element.obj = document.createElement("div");
        element.obj.classList.add("message__control");

        elemClass = icon.class;
        if (element.class == "agree") {
            elemClass = "green";
        } else if (element.class == "disagree") {
            elemClass = "red";
        }

        
        element.obj.classList.add(`message__control--${elemClass}`);
        element.obj.insertAdjacentHTML("beforeend", 
        `<img class="message__control-icon icon  icon--white  icon--wh40 icon--no-hover--white" src="assets/images/icons/${element.name}" alt="">`
        );
        element.obj.addEventListener("click", (e) => {
            let d = document.querySelector(".message-wrapper");

            element.obj.parentElement.parentElement.remove();
            if (d.children.length == 0) d.remove();
        });
        if (element.callback) element.obj.addEventListener("click", element.callback);

        if (waitingPromise) {
            element.obj.style.display = "none";
            if (waitingPromise) {
                waitingPromise.then(() => {
                    let d = document.querySelector(".message-wrapper");

                    element.obj.parentElement.parentElement.remove();
                    if (d.children.length == 0) d.remove();
                })
            }
        } else if (delay) {
            setTimeout(() => {
                let d = document.querySelector(".message-wrapper");

                element.obj.parentElement.parentElement.remove();
                if (d.children.length == 0) d.remove();
            }, delay);
        }
    });

    if (!messageWrapper)
    {
        document.querySelector(".header").insertAdjacentHTML(
            "afterbegin",
            `<div class="message-wrapper"></div>`
        )     
        messageWrapper = document.querySelector(".message-wrapper");
    }

    messageWrapper.insertAdjacentHTML(
        "beforeend",
        `<div class="message">
            <img class="message__icon message__icon--${icon.class} icon  icon--wh40" src="assets/images/icons/${icon.name}" alt="">
            <p class="message__text  message__text--${icon.class}  ">${text}</p>
            <div class="controls">
            </div>
        </div>`
    );

    controls.forEach(element => {
        messageWrapper.querySelectorAll(".controls")[messageWrapper.querySelectorAll(".controls").length - 1].insertAdjacentElement("beforeend", element.obj);
    });
}