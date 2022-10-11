import { player } from "./player.js";

let previousModal = "none";
let currentModal = "none";

export function openModal(modal) {
    previousModal = currentModal;

    if (modal == "main") {
        (function openMainModal() {
            document.querySelector(".modal-main").style.display = "flex";
            document.querySelector(".modal-about").style.display = "none";
            currentModal = "main";
        })();
    } else if (modal == "about") {
        (function openMainModal() {
            document.querySelector(".modal-main").style.display = "none";
            document.querySelector(".modal-about").style.display = "flex";
            currentModal = "about";
        })();
    } else if (modal == "none") {
        (function openMainModal() {
            document.querySelector(".modal-about").style.display = "none";
            currentModal = "none";
        })();
    }
}

    function isMatched(elem, target) {
        if (elem == target) {
            return true;
        }

        for (let i = 0; i < elem.children?.length; i++) 
        {
            if (isMatched(elem.children[i], target)) {
                return true;
            }
        }

        return false;
    }

    function onDocMouseUp(ev) {
        if (!isMatched(contextMenu, ev.target)) {
            menu.style.display = "none";
            if (isContextMenu) {
                isContextMenu = false;
            }
        }
    }


 
function modalGoBack() {
    if (previousModal == "about" || previousModal == "main") {
        openModal("main");
    } else {
        openModal("none");
    }
}

let backIcons = document.querySelectorAll(".modal__icon-back");
backIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        modalGoBack();
    });
});

window.addEventListener("load", function() {
    if (+localStorage.getItem("userId") == -1) {
        location.replace("login.html");
    }
});