import { player, AudioObject } from "./player.js";
import { Downloader } from "./downloader.js";
import { PlaylistAudioInstanceBuilder } from "./builders/playlistBuilder.js";

class Playlist {
    #list;

    constructor() {
        this.#list = [];
    }

    setPlaylistName(playlistName) {
        //document.querySelector(".library__playlist").innerText = playlistName;
    }

    setChannelName(channelName) { 
        document.querySelector(".library__channel").innerText = channelName;
    }

    setCoverUrl(coverUrl) {
        document.querySelector(".library__logo").style.backgroundImage = `url(${coverUrl})`;
    }

    add(obj) {
        let copy = new AudioObject(obj, new PlaylistAudioInstanceBuilder());
        this.#list.push(copy);
        let queueList = document.querySelector(".library__list");

        queueList.insertBefore(
            copy.audioInstance,
            null
        );
    }

    on() {
        player.clear();
        this.#list.forEach(audio => {
            player.add(audio);
        })
    }

    addToPlayer(state = "end") {
        if (state == "next") {
            for (let i = this.#list.length - 1; i >= 0; i--) {
                player.add(this.#list[i], state);
            }
        } else
        this.#list.forEach(audio => {
            player.add(audio, state);
        })
    }
}

let playlist = new Playlist();

window.onload = function() {

    Downloader.getLibraryDataByUserId(localStorage.getItem("userId")).then(data => {
        if (data) {
            let { libraryData, audioData } = data;

            if (libraryData) {
                playlist.setChannelName(libraryData.name);
                playlist.setCoverUrl(libraryData.coverUrl);            
            }

            if (audioData) {
                audioData.forEach(data => {
                    playlist.add(new AudioObject(data));
                })            
            }            
        }
    });

    document.querySelector(".library__on-button").onclick = function() {
        playlist.on();
    }

    player.hidden.func = (value) => {
       //if (!value)
        //document.querySelector(".library").style.height = "calc(100vh - 70px - 112px)";
        //else document.querySelector(".library").style.height = "calc(100vh - 70px)";
    }

    let elem = document.querySelector(".library");
    let menu = elem.querySelector(".context-menu__menu");
    let contextMenuObj = elem.querySelector(".context-menu__icon");
    let contextMenu = elem.querySelector(".context-menu");
    let isContextMenu = false;
    contextMenuObj.onclick = function(e) {
        if (isContextMenu) {
            isContextMenu = false;
        } else {
            isContextMenu = true;
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
            else if (e.clientY - (menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top) < 0) {
                menu.style.top =
                menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top + 20 + "px";
            }
            if (e.clientX + menu.getBoundingClientRect().right - menu.getBoundingClientRect().left > queueList.getBoundingClientRect().right) {
                menu.style.left =
                menu.getBoundingClientRect().left - menu.getBoundingClientRect().right - 20 + "px";
                alert(menu.style.left)
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
                isContextMenu = false;
            }
        }
    }
    document.addEventListener("mouseup", onDocMouseUp);

    contextMenu.querySelector(".context-menu--add-next").addEventListener("click", (e) => {
        playlist.addToPlayer("next");

        menu.style.display = "none";
        if (isContextMenu) {
            isContextMenu = false;
        }
    });
    contextMenu.querySelector(".context-menu--add-end").addEventListener("click", (e) => {
        playlist.addToPlayer("end");

        menu.style.display = "none";
        if (isContextMenu) {
            isContextMenu = false;
        }
    });
}