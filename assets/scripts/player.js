let playButtonObj
  , pauseButtonObj
  , nextButtonObj
  , previousButtonObj
  , showButtonObj
  , hideButtonObj
  , repeatNoneButtonObj
  , repeatButtonObj
  , repeatOnceButtonObj
  , randomButtonObj
  , volumeFullButtonObj
  , volumeSemiButtonObj
  , volumeZeroButtonObj
  , volumeMuteButtonObj
  , volumeButtonObj
  , volumeIconWrapperObj
  , volumeWrapperObj
  , volumeBarObj
  , volumeCurrentObj
  , volumePointerObj
  , progressBarObj
  , progressCurrentObj
  , progressPointerObj
  , audioTimeObj
  , audioCurrentTimeObj
  , audioTotalTimeObj
  , progressBarTimeObj
  , progressBarCurrentTimeObj
  , audioNameObj
  , audioChannelObj
  , audioPlaylistObj
  , audioLogoObj
  , queueLogoObj

  let prevState = {
    x: 0
}

const QUEUE_COORD = {
    bottom: document.querySelector(".queue__list").getBoundingClientRect().bottom
};

class PlayerAudioInstanceBuilder {

    createAudioInstance(audioObject) {
        audioObject.audioInstance = document.createElement("div");
        audioObject.audioInstance.classList.add("audio");
        audioObject.audioInstance.classList.add("audio--clickable");

        audioObject.audioInstance.insertAdjacentHTML(
            "afterbegin",
            `<div class="audio__logo" style="background-image: url(${audioObject.cover?.src})">
                <div class="audio__icons">
                    <img class="icon  icon--wh40  icon--margin-none  icon--white  icon--no-hover--white  audio__play-icon" style="display: block;" src="assets/images/icons/play.svg" alt="">
                    <div class="icon-wrapper" style="display: none;">
                        <img class="icon  icon--wh40  icon--margin-none  icon--white  icon--no-hover--white  audio__pause-icon" src="assets/images/icons/pause.svg" alt="">
                        <img class="icon  icon--wh40  icon--margin-none  icon--white  icon--no-hover--white  audio__playing-icon" src="assets/images/icons/volume-full.svg" alt="">
                    </div>
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
                            <img class="icon  icon--wh40  button__icon" src="assets/images/icons/playlist-queue.svg" alt="">
                            <p class="context-menu__text  button__text">Включить следующим</p>
                        </div>
                        <div class="context-menu__button  button  context-menu--add-end">
                            <img class="icon  icon--wh40  button__icon" src="assets/images/icons/playlist-play.svg" alt="">
                            <p class="context-menu__text  button__text">Добавить в очередь</p>
                        </div>
                        <div class="context-menu__button  button  context-menu--delete">
                            <img class="icon  icon--wh40 button__icon" src="assets/images/icons/delete.svg" alt="">
                            <p class="context-menu__text button__text">Удалить из очереди</p>
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
                let queueList = document.querySelector(".queue__list");
               
                menu.style.display = "block";  
                if (e.clientY + menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top > queueList.getBoundingClientRect().bottom - queueList.clientHeight) {
                    menu.style.top =
                    menu.getBoundingClientRect().top - menu.getBoundingClientRect().bottom - 20 + "px";
                }
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
            player.queue.add(audioObject, "next");
    
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
            player.queue.add(audioObject, "end");
    
            menu.style.display = "none";
            if (isContextMenu) {
                elem.querySelector(".time").style.display = null;
                elem.querySelector(".context-menu").style.display = null;
                isContextMenu = false;
                document.querySelector(".queue__list").style.overflowY = "scroll";
                document.querySelector(".queue__list").style.marginRight = "0";
            }
        });
        contextMenu.querySelector(".context-menu--delete").addEventListener("click", (e) => {
            player.queue.delete(audioObject);
    
            menu.style.display = "none";
            if (isContextMenu) {
                isContextMenu = false;
                elem.querySelector(".time").style.display = null;
                elem.querySelector(".context-menu").style.display = null;
                document.querySelector(".queue__list").style.overflowY = "scroll";
                document.querySelector(".queue__list").style.marginRight = "0";
            }
        });

        
        let elemIconObj = elem.querySelector(".audio__icons");
        elemIconObj.querySelector(".audio__play-icon").addEventListener("click", (e) => {       
            player.queue.set(audioObject);
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

class Control {
    #list;

    constructor() {
        this.#list = new Map();
    }

    #onSwitch(key) {
        let current = {
            key,
            value: this.#list.get(key)
        };
        let list = Array.from(this.#list, ([key, value]) => ({ key, value }));
        let index = list.findIndex((value) => {
            return (value.key == current.key);
        });

        current.value.item.style.display = "none";
        
        if (index + 1 < list.length) {  
            list[index + 1].value.item.style.display = "block";
        } else {
            list[0].value.item.style.display = "block";
        }
    }

    add(item, key, func) {
        if (item) {
            item.addEventListener("click", () => {
                func();
                this.do(key);
            });
            this.#list.set(key, { item, func });            
        }
    }

    do(key) {
        this.#onSwitch(key);
    }
};

class Controller {
    #controls;

    constructor() {
        this.#controls = new Map();
    }

    add(control, key) {
        this.#controls.set(key, control);
    }

    do(controlKey, itemKey) {
        this.#controls.get(controlKey).do(itemKey);
    }
}

class AudioObject {
    constructor(audioData = null, builder = null) {
        if (audioData instanceof AudioObject) {
            this.audioName = audioData.audioName;
            this.playlistName = audioData.playlistName;
            this.channelName = audioData.channelName;
            this.audio = audioData.audio;
            this.cover = audioData.cover;
            if (audioData.cover)
            this.cover.src = audioData.cover.src;
            this.controller = null;
            //this.audio.currentTime = 0;

            if (builder) {
                this.createAudioInstance(builder);
            } else {
                this.audioInstance = null;
            }         
        } else {
            this.audioName = audioData.title;
            this.playlistName = audioData.playlistName;
            this.channelName = audioData.userName;
            if (audioData.audio) {
                this.audio = audioData.audio;
            } else {
                this.audio = new Audio();
                //this.audio.crossOrigin = "anonymous";
                this.audio.src = audioData.audioUrl;           
            }
            if (!audioData.cover) {
                this.cover = new Image();           
            }

            else {
                this.cover = audioData.cover;
            }

            if (audioData.coverUrl && this.cover?.src != undefined) {
                this.cover.src = audioData.coverUrl;   
            }

            this.audioInstance = null;
            this.controller = null;
            this.audio.currentTime = 0;

            if (builder) {
                this.createAudioInstance(builder);
            } else {
                this.audioInstance = null;
            }  

            let audioObj = this.audio;
            audioObj.addEventListener("timeupdate", () => {
                if (!prevState.is) {
                    audioCurrentTimeObj.innerText = getTime(Math.floor(audioObj.currentTime));
                    progressCurrentObj.style.width = (parseFloat(audioObj.currentTime) / getSeconds(audioTotalTimeObj.innerText)) * 100 + "%";
                    
                    prevState.x = parseFloat(progressCurrentObj.style.width) * (+document.documentElement.clientWidth / 100);
                } 
            });
            audioObj.addEventListener("ended", () => {
                if (player.queue.repeat == "once") {
                    player.queue.set(player.queue.current());
                } else {
                    //alert();
                    player.queue.set(player.queue.next());
                }
            })
        }

        if (this.audio.duration) {
            this.duration = this.audio.duration;
            if (this.audioInstance) this.audioInstance.querySelector(".time__total").innerText = getTime(this.duration);
        } else {
            this.audio.addEventListener("loadedmetadata", e => {
                this.duration = this.audio.duration;
                if (this.audioInstance) this.audioInstance.querySelector(".time__total").innerText = getTime(this.duration);
               // console.log("Metadata loaded");   
            });      
            this.audio.addEventListener("loadeddata", e => {
                //console.log("Data loaded");
            });           
        }
    }

    createAudioInstance(builder) {
        buildAudioInstance(this, builder);
        this.controller = new Controller();
        let control = new Control();
        control.add(
            this.audioInstance.querySelector(".audio__play-icon"),
            "play",
            () => {
                this.play();
            }
        );            
        control.add(
            this.audioInstance.querySelector(".icon-wrapper"),
            "pause",
            () => {
                this.pause();
            }
        );
        this.controller.add(control, "playable");
    }

    play() {
        this.controller.do("playable", "play");
        player.controller.do("playable", "play");
        this.audio.play();
    }

    pause() {
        this.controller.do("playable", "pause");
        player.controller.do("playable", "pause");
        this.audio.pause();
    }

    out() {
        if (!this.audio.paused || this.audio.ended) {
            this.pause();
        }
        
        this.audioInstance.querySelector(".audio__icons").style.display = null;
    }

    in() {
        this.audioInstance.querySelector(".audio__icons").style.display = "flex";
        this.audio.currentTime = 0;
        this.play();
    }
}

function buildAudioInstance(audioObject, audioInstanceBuilder) {
    audioInstanceBuilder.createAudioInstance(audioObject);
    audioInstanceBuilder.initAudioInstance(audioObject);
}

class Queue {
    #list;
    #current;

    constructor() {
        this.#list = [];
        this.#current = null;
        this.repeat = "none";
    }

    add(obj, state = "end") {
        let copy = new AudioObject(obj, new PlayerAudioInstanceBuilder());
        let queueList = document.querySelector(".queue__list");

        if (state == "next") {
            let index = this.#list.indexOf(this.#current);
            queueList.insertBefore(
                copy.audioInstance,
                this.#list[index + 1]?.audioInstance
            );
            
            this.#list.splice(index + 1, 0, copy);
        } else if (state == "end") {
            this.#list.push(copy);

            queueList.insertBefore(
                copy.audioInstance,
                null
            );
        }   

        if (!this.#current) {
            this.set(copy);
        }            
    }

    clear() {
        let length = this.#list.length;

        for (let i = 0; i < length; i++) {
            this.delete(this.#list[0], true);
        }
    }

    delete(obj, isClearing = false) {
        let index = this.#list.indexOf(obj);
        let currentIndex = this.#list.indexOf(this.#current);

        let queueList = document.querySelector(".queue__list");
        queueList.removeChild(queueList.children[index]);      
        this.#list.splice(index, 1);

        if (index == currentIndex) {
            if (!obj.audio.paused) obj.pause();
            if (index >= this.#list.length && index != 0 && !isClearing) {
                this.set(this.#list[index - 1]);
            } else if (this.#list.length > 0 && !isClearing) {
                this.set(this.#list[index]);
            } else {
                player.hidden.value = true;
                player.hidden.func(player.hidden.value);
                showButtonObj.style.display = "block";
                hideButtonObj.style.display = "none";
                audioLogoObj.style.backgroundImage = `none`;
                queueLogoObj.style.backgroundImage = `none`;

                document.querySelector("#queue").style.top = "0";
                document.body.style.overflowY = null;
                let footer = document.querySelector(".footer");
                footer.style.bottom = footer.getBoundingClientRect().top - 
                footer.getBoundingClientRect().bottom + "px";
                this.#current = null;
            }                
        }
    }

    #changeCurrentObj(audioObj) {
        if (this.#current != audioObj) {
            audioTotalTimeObj.innerText = getTime(audioObj.audio.duration);

            audioNameObj.innerText = audioObj.audioName;
            audioChannelObj.innerText = audioObj.channelName;
            audioPlaylistObj.innerText = audioObj.playlistName;

            audioLogoObj.style.backgroundImage = `url(${audioObj.cover?.src})`;
            queueLogoObj.style.backgroundImage = `url(${audioObj.cover?.src})`;

            if (this.#current == null) {
                this.#current = audioObj;
                this.#current.in();
            } else {
                audioObj.audio.muted = this.#current.audio.muted;
                audioObj.audio.volume = this.#current.audio.volume;

                this.#current.out();
                audioObj.in();

                progressCurrentObj.style.width = "0%";
                prevState.x = 0;
                audioCurrentTimeObj.innerText = "0:00";
                
            } 
            this.#current = audioObj;                   
        } else if (this.repeat == "once") {
            audioObj.play();
        }
    }

    current() {
        return this.#current;
    }

    set(audioObj) {
        if (audioObj instanceof AudioObject) {
            this.#changeCurrentObj(audioObj);
        } else if (this.#current.audio.paused) {
            this.pause();
        }
    }

    next(obj = null) {
        if (obj) {
            let index = this.#list.indexOf(obj);
            if (index + 1 < this.#list.length) {
                return this.#list[index + 1];
            } else {
                return null;
            }           
        } else {
            let index = this.#list.indexOf(this.#current);
            if (index + 1 < this.#list.length) {
                return this.#list[index + 1];
            } else if (this.repeat == "repeat") {
                //alert();
                return this.#list[0];
            } else {
                return null;
            }
        }
    } 

    previous(obj = null) {
        if (obj) {
            let index = this.#list.indexOf(obj);
            if (index - 1 >= 0) {
                return this.#list[index - 1];
            } else {
                return null;
            }           
        } else {
            let index = this.#list.indexOf(this.#current);
            if (index - 1 >= 0) {
                return this.#list[index - 1];
            } else {
                return null;
            }                
        }
    }

    swap(first, second) {
        let index1, index2, buffer;

        if (first != undefined && second != undefined) {
            if (typeof first == "number") {
                index1 = first;
            } else if (first == "current") {
                index1 = this.#list.indexOf(this.#current);
            } else {
                index1 = this.#list.indexOf(first);
            }

            if (typeof second == "number") {
                index2 = second;
            } else if (second == "current") {
                index2 = this.#list.indexOf(this.#current);
            } else {
                index2 = this.#list.indexOf(second);
            }

            buffer = this.#list[index1];
            this.#list[index1] = this.#list[index2];
            this.#list[index2] = buffer;   

            let queueList = document.querySelector(".queue__list");
            let nextOfObj1 = this.#list[index1].audioInstance.nextSibling;
            let nextOfObj2 = this.#list[index2].audioInstance.nextSibling;          

            queueList.insertBefore(
                this.#list[index2].audioInstance,
                nextOfObj1
            );
            queueList.insertBefore(
                this.#list[index1].audioInstance, 
                nextOfObj2
            );

            if (this.#current == first) {
                this.#current = this.#list[index2];
            } else if (this.#current == second) {
                this.#current = this.#list[index1];
            }
        }
    }

    length() {
        return this.#list.length;
    }

    play() {
        this.#current.play();
    }

    pause() {
        this.#current.pause();
    }
}

function createControl(values) {
    let control = new Control();
    
    values.forEach(value => {
        control.add(value.item, value.key, value.func);
    });
    
    return control;
}

class Player {
    #blockFunc(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        return false;
    }

    block() {
        document.querySelector(".footer").addEventListener("click", this.#blockFunc, { capture: true });
    }

    unblock() {
        document.querySelector(".footer").removeEventListener("click", this.#blockFunc, { capture: true })
    }

    clear() {
        this.queue.clear();
    }

    #showQueue() {
        if (showButtonObj.style.display == "block")
        switchObjDisplayProperty(showButtonObj, hideButtonObj);
        document.querySelector("#queue").style.top = `calc(
        ${document.querySelector("#queue").getBoundingClientRect().top -
        document.querySelector("#queue").getBoundingClientRect().bottom + "px"})`;
        document.body.style.overflowY = "hidden";
    }

    #hideQueue() {
        if (showButtonObj.style.display == "none")
        switchObjDisplayProperty(showButtonObj, hideButtonObj)
        document.querySelector("#queue").style.top = "0";
        document.body.style.overflowY = null;
    }

    hidePlayer() {
        this.hidden.value = true;
        this.hidden.func(this.hidden.value);
        this.#hideQueue();
        showButtonObj.style.display = "block";
        hideButtonObj.style.display = "none";
        audioLogoObj.style.backgroundImage = `none`;
        queueLogoObj.style.backgroundImage = `none`;

        document.querySelector("#queue").style.top = "0";
        document.body.style.overflowY = null;
        let footer = document.querySelector(".footer");
        footer.style.bottom = footer.getBoundingClientRect().top - 
        footer.getBoundingClientRect().bottom + "px";
    }

    showPlayer() {
        this.hidden.value = false;
        this.hidden.func(this.hidden.value);
        showButtonObj.style.display = "block";
        hideButtonObj.style.display = "none";

        this.#hideQueue();
        let footer = document.querySelector(".footer");
        footer.style.bottom = null;
    }

    constructor() {
        this.hidden = {
            value: false,
            func: function() {
    
            }
        };

        this.controller = new Controller();
        this.queue = new Queue();
        
        this.controller.add(
            createControl([
                {   
                    item: document.querySelector("#play"),
                    key: "play",
                    func: () => {
                        this.queue.play();
                    }
                },
                {
                    item: document.querySelector("#pause"), 
                    key: "pause",
                    func: () => {
                        this.queue.pause();
                    }
                }
            ]), 
            "playable"
        );
        this.controller.add(
            createControl([
                {
                    item: document.querySelector("#next"),
                    key: "next", 
                    func: () => {
                        if (this.queue.repeat == "once") {
                            this.queue.set(this.queue.current());
                        } else {
                            this.queue.set(this.queue.next());
                        }
                    }
                }
            ]),
            "next"
        );
        this.controller.add(
            createControl([
                {
                    item: document.querySelector("#previous"),
                    key: "previous", 
                    func: () => {
                        this.queue.set(this.queue.previous());
                    }
                }
            ]),
            "previous"
        );
        this.controller.add(
            createControl([
                {
                    item: document.querySelector("#repeatNone"), 
                    key: "none",
                    func: () => {
                        this.queue.repeat = "repeat";
                    }
                },              
                {   
                    item: document.querySelector("#repeat"),
                    key: "repeat",
                    func: () => {
                        this.queue.repeat = "once";
                    }
                },
                {
                    item: document.querySelector("#repeatOnce"), 
                    key: "once",
                    func: () => {
                        this.queue.repeat = "none";
                    }
                }
            ]), 
            "repeat"
        );
        this.controller.add(
            createControl([
                {
                    item: document.querySelector("#random"),
                    key: "random", 
                    func: () => {
                        this.queue.swap(0, "current");

                        let size = this.queue.length();
                        for (let i = 1; i < size; i++) {
                            let index = Math.floor(Math.random() * (size - 1) + 1);
                            if (i !== index) {
                                this.queue.swap(i, index); 
                            }
                        }
                    }
                }
            ]),
            "random"
        );

        showButtonObj = document.querySelector("#show");
        hideButtonObj = document.querySelector("#hide");
        volumeFullButtonObj = document.querySelector("#volumeFull");
        volumeSemiButtonObj = document.querySelector("#volumeSemi");
        volumeZeroButtonObj = document.querySelector("#volumeZero");
        volumeMuteButtonObj = document.querySelector("#volumeMute");
        volumeIconWrapperObj = document.querySelector("#volumeIconWrapper");
        volumeWrapperObj = document.querySelector("#volumeWrapper");
        volumeBarObj = document.querySelector("#volumeBar");
        volumeCurrentObj = document.querySelector("#volumeCurrent");
        volumePointerObj = document.querySelector("#volumePointer");
        progressBarObj = document.querySelector("#progressBar");
        progressCurrentObj = document.querySelector("#progressCurrent");
        progressPointerObj = document.querySelector("#progressPointer");
        audioTimeObj = document.querySelector("#audioTime");
        audioCurrentTimeObj = document.querySelector("#audioCurrentTime");
        audioTotalTimeObj = document.querySelector("#audioTotalTime");
        progressBarTimeObj = document.querySelector("#progressBarTime");
        progressBarCurrentTimeObj = document.querySelector("#progressBarCurrentTime");
        audioNameObj = document.querySelector("#audioName");
        audioChannelObj = document.querySelector("#audioChannel");
        audioPlaylistObj = document.querySelector("#audioPlaylist");
        queueLogoObj = document.querySelector("#queueLogo");
        audioLogoObj = document.querySelector("#audioLogo");
    
        prevState.x = parseFloat(progressCurrentObj.style.width) * (+document.documentElement.clientWidth / 100);
    
        volumeButtonObj = volumeFullButtonObj;
        volumeButtonObj.onclick = muteAudio;

        window.onresize = function(e) {
            if (parseInt(document.documentElement.clientWidth) > 960) {
                document.querySelector(".wrapper__inner").style.display = null;
                document.querySelector(".wrapper__icon").style.display = null;
            } else {
                document.querySelector(".wrapper__icon").style.display = null;
                document.querySelector(".wrapper__inner").style.display = null;
            }
            if (document.querySelector("#queue").style.top != "0px") {
                document.querySelector("#queue").style.top = `calc(
                ${document.querySelector("#queue").getBoundingClientRect().top -
                document.querySelector("#queue").getBoundingClientRect().bottom + "px"})`;
            }
        }
    
        showButtonObj.onclick = this.#showQueue;
        hideButtonObj.onclick = this.#hideQueue;
    
        function muteAudio() {
            switchObjDisplayProperty(volumeButtonObj, volumeMuteButtonObj);
            player.queue.current().audio.muted = !player.queue.current().audio.muted;
        }
    
        volumeMuteButtonObj.onclick = function() {
            muteAudio();
        }
    
        volumeIconWrapperObj.onmouseenter = function() {
            volumeBarObj.style.visibility = "visible";
        }
    
        let isMouseMove = false;
    
        volumeWrapperObj.onmouseleave = function() {
            onMouseLeave();
        }
    
        let previousStates = {
            x: parseInt(volumeCurrentObj.style.width) + volumeCurrentObj.getBoundingClientRect().left
        };
    
        function onMouseLeave() {
            if (!isMouseMove) {
                volumeBarObj.style.visibility = "hidden";            
            }
        }
    
        function onMouseMove(event) {
            let width = parseInt(volumeCurrentObj.style.width) - (previousStates.x - event.clientX); 
    
            if (width <= 100 && width >= 0) {
                volumeCurrentObj.style.width = width + "%";
                player.queue.current().audio.volume = width / 100;
                previousStates.x = event.clientX;
    
                if (width == 0) {
                    switchObjDisplayProperty(volumeButtonObj, volumeZeroButtonObj);
                    volumeButtonObj = volumeZeroButtonObj;
                } else if (width <= 50) {
                    switchObjDisplayProperty(volumeButtonObj, volumeSemiButtonObj);
                    volumeButtonObj = volumeSemiButtonObj;
                } else {
                    switchObjDisplayProperty(volumeButtonObj, volumeFullButtonObj);
                    volumeButtonObj = volumeFullButtonObj;
                }
    
                volumeButtonObj.onclick = muteAudio;
                if (volumeMuteButtonObj.style.display === "block") {
                    muteAudio();
                }   
            }
        }
    
        function onMouseUp(e) {
            isMouseMove = false;        
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
    
            if (e.target !== volumeWrapperObj && 
                e.target !== volumeCurrentObj &&
                e.target !== volumePointerObj &&
                e.target !== volumeBarObj &&
                e.target !== volumeIconWrapperObj ) {
                onMouseLeave();            
            }
        }
    
        function onMouseDown(e) {
            previousStates.x = e.clientX;
            isMouseMove = true;
    
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            volumePointerObj.ondragstart = function() {
                return false;
            }
            volumePointerObj.selectstart = function() {
                return false;
            }
        }
        volumePointerObj.onmousedown = onMouseDown;
    
        volumeBarObj.onmousedown = function(e) {
            onMouseMove(e);
            onMouseDown(e);
        }
    
        audioCurrentTimeObj.innerText = getTime(getSeconds(audioTotalTimeObj.innerText) / 100 * parseInt(progressCurrentObj.style.width));
    
        function onPointerMouseMove(event) {
            let width = ((parseFloat(progressCurrentObj.style.width) - (prevState.x - event.clientX) / (+document.documentElement.clientWidth / 100))).toFixed(3); 
    
            if (width <= 100 && width >= 0) {
                progressCurrentObj.style.width = width + "%";
                prevState.is = true;
                audioCurrentTimeObj.innerText = getTime(getSeconds(audioTotalTimeObj.innerText) / 100 * width);
                prevState.sec = getSeconds(audioTotalTimeObj.innerText) / 100 * width;
            }
            prevState.x = event.clientX;
        }    
    
        function onPointerMouseUp() {
            player.queue.current().audio.currentTime = prevState.sec;
            prevState.is = false;
            document.removeEventListener("mousemove", onPointerMouseMove);
            document.removeEventListener("mouseup", onPointerMouseUp);
        }
    
        function onPointerMouseDown(e) {
            prevState.x = e.clientX;
    
            document.addEventListener("mousemove", onPointerMouseMove);
            document.addEventListener("mouseup", onPointerMouseUp);
            progressPointerObj.ondragstart = function() {
                return false;
            }
            progressPointerObj.selectstart = function() {
                return false;
            }
        }
    
        progressPointerObj.onmousedown = onPointerMouseDown;
    
        progressBarObj.onmousedown = function(e) {
            onPointerMouseMove(e);
            onPointerMouseDown(e);
        }
    
        progressBarObj.onmouseenter = function(e) {
            function onProgressBarMouseMove(ev) {
                //alert(document.documentElement.clientWidth);
                progressBarTimeObj.style.left = ev.clientX + "px";
                progressBarCurrentTimeObj.innerText = getTime((getSeconds(audioTotalTimeObj.innerText) / document.documentElement.clientWidth * ev.clientX).toFixed(0));
            }
    
            function onProgressBarMouseLeave(ev) {
                progressBarObj.addEventListener("mousemove", onProgressBarMouseMove);
                progressBarObj.addEventListener("mouseleave", onProgressBarMouseLeave);
            }
    
            onProgressBarMouseMove(e);
            progressBarObj.addEventListener("mousemove", onProgressBarMouseMove);
            progressBarObj.addEventListener("mouseleave", onProgressBarMouseLeave);
        }
    
        let menu = document.querySelector("#contextMenuMenu");
        let contextMenuObj = document.querySelector("#contextMenuIcon");
        let contextMenu = document.querySelector("#contextMenu");
        contextMenuObj.onclick = function(e) {
            if (menu.style.display == "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
                if (e.clientY + menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top > document.documentElement.clientHeight) {
                    menu.style.top =
                    menu.getBoundingClientRect().top - menu.getBoundingClientRect().bottom - 20 + "px";
                }
                else if (e.clientY - (menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top) < 0) {
                    menu.style.top =
                    menu.getBoundingClientRect().bottom - menu.getBoundingClientRect().top + 20 + "px";
                }
                if (e.clientX + menu.getBoundingClientRect().right - menu.getBoundingClientRect().left > document.documentElement.clientWidth) {
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

        document.querySelector(".wrapper__icon").onclick = function() {
            document.querySelector(".wrapper__icon").style.display = "none";
            document.querySelector(".wrapper__inner").style.display = "flex";
        }

        document.querySelector(".wrapper__icon2").onclick = function() {
            document.querySelector(".wrapper__icon").style.display = "flex";
            document.querySelector(".wrapper__inner").style.display = "none";
        }
    
        function onDocumentMouseUp(ev) {
            if (!isMatched(contextMenu, ev.target)) {
                menu.style.display = "none";
            }
        }
        document.addEventListener("mouseup", onDocumentMouseUp);
    
        contextMenu.querySelector(".context-menu--add-next").addEventListener("click", (e) => {
            player.queue.add(player.queue.current(), "next", true);
    
            menu.style.display = "none";
        });
        contextMenu.querySelector(".context-menu--add-end").addEventListener("click", (e) => {
            player.queue.add(player.queue.current(), "end", true);
    
            menu.style.display = "none";
        });
        contextMenu.querySelector(".context-menu--delete").addEventListener("click", (e) => {
            player.queue.delete(player.queue.current());
    
            menu.style.display = "none";
        });

        this.hidePlayer();
    }

    add(obj, state = "end") {
        this.queue.add(obj, state);
        if (this.hidden.value) this.showPlayer();
    }
}

function switchObjDisplayProperty(obj1, obj2) {
    const bufferDisplayProperty = obj1.style.display;
    obj1.style.display = obj2.style.display;
    obj2.style.display = bufferDisplayProperty;
}

export function getSeconds(string) {
    string = string.toString().split(":");
    return +string[0] * 60 + +string[1];
}

export function getTime(sec) {
    let time = {
        m1: 0,
        m2: 0,
        s1: 0,
        s2: 0,

        toString() {
            return this.m1 + this.m2 + ":" + this.s1 + this.s2;
        }
    }

    time.m1 = Math.floor(sec / 3600);
    sec -= time.m1 * 3600;
    time.m2 = Math.floor(sec / 60);
    sec -= time.m2 * 60;
    time.s1 = Math.floor(sec / 10);
    sec -= time.s1 * 10;
    time.s2 = Math.floor(sec);

    return time.toString();
}

let player = new Player();

if (!localStorage.getItem("userId")) localStorage.setItem("userId", -1);

export { player };
export { AudioObject };