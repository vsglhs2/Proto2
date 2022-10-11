import { player } from "../player.js"

export class PlaylistAudioInstanceBuilder {
    createAudioInstance(audioObject) {
        audioObject.audioInstance = document.createElement("div");
        audioObject.audioInstance.classList.add("audio");
        audioObject.audioInstance.classList.add("audio--clickable");

        audioObject.audioInstance.insertAdjacentHTML(
            "afterbegin",
            `<div class="audio__logo" style="background-image: url(${audioObject.cover.src})">
                <div class="audio__icons">
                    <img class="icon  icon--wh40  icon--margin-none  icon--white  icon--no-hover--white  audio__play-icon" style="display: block;" src="assets/images/icons/play.svg" alt="">
                </div>
            </div>
            <div class="audio__info">
                <h3 class="audio__name">${audioObject.audioName}</h3>
                <div class="audio__wrapper">
                    <span class="audio__channel">${audioObject.channelName}</span>
                    <span class="audio__playlist">${audioObject.playlistName}</span>                        
                </div>
            </div>
            <div class="audio__inner">
                <div class="time">
                    <span class="time__total">${audioObject.duration}</span>
                </div>  
                <div class="context-menu  audio__menu">
                    <img class="icon  icon--wh40  icon--margin-none  audio__icon  context-menu__icon" src="assets/images/icons/etc.svg"alt="">
                    <div class="context-menu__menu" style="top: 0; left: 0">
                        <div class="context-menu__button  button  context-menu--add-next">
                            <img class="icon  icon--wh40  button__icon" src="/assets/images/icons/playlist-queue.svg" alt="">
                            <p class="context-menu__text  button__text">Включить следующим</p>
                        </div>
                        <div class="context-menu__button  button  context-menu--add-end">
                            <img class="icon  icon--wh40  button__icon" src="/assets/images/icons/playlist-play.svg" alt="">
                            <p class="context-menu__text  button__text">Добавить в очередь</p>
                        </div>
                    </div>
                </div>
            </div>`
        );
    }
    
    initAudioInstance(audioObject) {
        let elem = audioObject.audioInstance;
        let menu = elem.querySelector(".context-menu__menu");
        let contextMenuObj = elem.querySelector(".context-menu__icon");
        let contextMenu = elem.querySelector(".context-menu");
        let isContextMenu = false;
        contextMenuObj.onclick = function(e) {
            document.querySelector(".queue__list").style.overflow = "hidden";
            document.querySelector(".queue__list").style.marginRight = "16px";

            if (isContextMenu) {
                isContextMenu = false;
                elem.querySelector(".time").style.display = null;
                elem.querySelector(".context-menu").style.display = null;
                document.querySelector(".queue__list").style.overflowY = "scroll";
                document.querySelector(".queue__list").style.marginRight = "0";
            } else {
                isContextMenu = true;
                elem.querySelector(".time").style.display = "none";
                elem.querySelector(".context-menu").style.display = "block";
            }

            if (menu.style.display == "block") {
                menu.style.display = "none";
            } else {
                let queueList = document.querySelector(".library__list");
                menu.style.display = "block";
                if (e.clientY + menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top > queueList.getBoundingClientRect().bottom - queueList.clientHeight) {
                    menu.style.top =
                    menu.getBoundingClientRect().top - menu.getBoundingClientRect().bottom - 20 + "px";
                }
                console.log(e.clientY, menu.getBoundingClientRect().bottom, menu.getBoundingClientRect().top, queueList.getBoundingClientRect().top)
                if (e.clientY - (menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top) < queueList.getBoundingClientRect().top) {
                    menu.style.top =
                    20 + "px";
                }
                if (e.clientX + menu.getBoundingClientRect().right - menu.getBoundingClientRect().left > queueList.getBoundingClientRect().right) {
                    menu.style.left =
                    menu.getBoundingClientRect().left - menu.getBoundingClientRect().right - 20 + "px";
                }
                else if (e.clientX - (menu.getBoundingClientRect().right - menu.getBoundingClientRect().left) < 0) {
                    menu.style.left =
                    menu.getBoundingClientRect().right - menu.getBoundingClientRect().left + 20 + "px";
                }            
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
                    elem.querySelector(".time").style.display = null;
                    elem.querySelector(".context-menu").style.display = null;
                    isContextMenu = false;
                    document.querySelector(".queue__list").style.overflowY = "scroll";
                    document.querySelector(".queue__list").style.marginRight = "0";
                }
            }
        }
        document.addEventListener("mouseup", onDocMouseUp);
    
        contextMenu.querySelector(".context-menu--add-next").addEventListener("click", (e) => {
            player.add(audioObject, "next");
    
            menu.style.display = "none";
            if (isContextMenu) {
                isContextMenu = false;
                elem.querySelector(".time").style.display = null;
                elem.querySelector(".context-menu").style.display = null;
                document.querySelector(".queue__list").style.overflowY = "scroll";
                document.querySelector(".queue__list").style.marginRight = "0";
            }
        });
        contextMenu.querySelector(".context-menu--add-end").addEventListener("click", (e) => {
            player.add(audioObject, "end");
    
            menu.style.display = "none";
            if (isContextMenu) {
                elem.querySelector(".time").style.display = null;
                elem.querySelector(".context-menu").style.display = null;
                isContextMenu = false;
                document.querySelector(".queue__list").style.overflowY = "scroll";
                document.querySelector(".queue__list").style.marginRight = "0";
            }
        });

        
        let elemIconObj = elem.querySelector(".audio__icons");
        elemIconObj.querySelector(".audio__play-icon").addEventListener("click", (e) => {       
            player.clear();
            player.add(audioObject);
        });
        elem.addEventListener("mousedown", (e) => {
            elem.ondragstart = function() {
                return false;
            }
            elem.selectstart = function() {
                return false;
            }

            function onElemMouseMove(ev) {
                if (ev.clientY > player.queue.next(audioObject)?.audioInstance.getBoundingClientRect().top) {
                    player.queue.swap(audioObject, player.queue.next(audioObject));
                }
                if (ev.clientY < player.queue.previous(audioObject)?.audioInstance.getBoundingClientRect().bottom) {
                    player.queue.swap(audioObject, player.queue.previous(audioObject));
                }
            }

            function onElemMouseUp(ev) {
                document.removeEventListener("mousemove", onElemMouseMove);
                document.removeEventListener("mouseup", onElemMouseUp);
            }

            document.addEventListener("mousemove", onElemMouseMove);
            document.addEventListener("mouseup", onElemMouseUp);
        });
    }

};