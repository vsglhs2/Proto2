import { player, AudioObject, getTime } from "./player.js";
import { Downloader } from "./downloader.js";
import { createMessage } from "./message.js"

window.onload = function() {
    player.block();

    let currentAudioData = {};
    let downloadButton = document.querySelector("#download__open");
    let changeButton = document.querySelector("#download__change");
    let cancelButton = document.querySelector("#download_cancel");


    let form = document.querySelector(".download");

    player.showPlayer();

    cancelButton.addEventListener("click", () => {
        createMessage("Вы уверены, что хотите отменить загрузку аудиозаписи?", "dialog", [{controlType: "agree", callback: () => {location.replace("etc.html");}}, {controlType: "disagree"}]);
    });

    form.addEventListener("submit", (e) => {
        let status = { one: false, two: false};
        document.querySelector(".download__title").value = document.querySelector("#audioName").innerText;
        document.querySelector(".download__duration").value = document.querySelector(".time__total").innerText;
        document.querySelector(".download__channel").value = localStorage.getItem("userId");        

        console.log(document.querySelector(".download__title").value)
        e.preventDefault();

        let a, b;

        if (a = !document.querySelector("#download__open").files[0]) {
            createMessage("Аудиозапись не была выбрана!", "warning");
        }

        if (b = !document.querySelector("#download__change").files[0]) {
            createMessage("Обложка аудиозаписи не была выбрана!", "warning");
        }

        if (document.querySelector(".download__title").value != "Название аудиозаписи" && !a && !b) {
            let options = {
                method: "GET",
                headers: {
                    "Authorization" : `OAuth ${localStorage.getItem("userId")}`,
                    "Accept" : "application/json",                
                    "Content-Type" : "application/json",
                }
            };

            let promise1; fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${document.querySelector("#download__open").files[0].name}`, options).then((res) => res.json()).then(data => {

                promise1 = fetch(data.href, {
                    method: "PUT",
                    body: document.querySelector("#download__open").files[0]
                }).then(res => {
                    form.reset();
                    if (res.status == 201) {
                        status.one = true;
                        createMessage("Аудиозапись успешно загружена!", "info", [{controlType: "close", callback: () => {location.reload();}}]);
                    } else {
                        createMessage("Ошибка при загрузке аудиозаписи!", "critical", [{controlType: "close", callback: () => {}}]);
                    }
                });   
                createMessage("Обложка загружается на сервер!", "waiting", [{controlType: "close", callback: () => {}} ], promise1);
            });

            let promise2; fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${document.querySelector("#download__change").files[0].name}`, options).then((res) => res.json()).then(data => {

                promise2 = fetch(data.href, {
                    method: "PUT",
                    body: document.querySelector("#download__change").files[0]
                }).then(res => {
                    form.reset();
                    if (res.status == 201) {
                        status.one = true;
                        createMessage("Обложка успешно загружена!", "info", [{controlType: "close", callback: () => {}}]);
                    } else {
                        createMessage("Ошибка при загрузке обложки!", "critical", [{controlType: "close", callback: () => {}}]);
                    }
                });  
                createMessage("Аудиозапись загружается на сервер!", "waiting", [{controlType: "close", callback: () => {}}], promise2); 
            });

            let href, text;

           fetch(`https://cloud-api.yandex.net/v1/disk/resources/download?path=disk:/files.txt`, options).then(res => res.json()).then(data => {   
                href = data.href;
                fetch(href).then(res => res.text()).then((data) => {
                    text = data;
                    text = text.split("\n");
                    for (let i = 0; i < text.length; i++) {
                        text[i] = text[i].split(" ");
                    }
                    text.push(new Array(document.querySelector("#download__open").files[0].name, document.querySelector("#download__change").files[0].name));
                    console.log(text)
                    for (let i = 0; i < text.length; i++) {
                        text[i] = text[i].join(" ");
                    }

                    text = text.join("\n");
                    console.log(text);
                }).then(() => {
                    fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/files.txt&overwrite=true`, options).then((res) => res.json()).then(data => {
                        fetch(data.href, {
                            method: "PUT",
                            body: text
                        }); 
                    });
                })
            });  
            
        } else if (document.querySelector(".download__title").value == "Название аудиозаписи") {
            createMessage("Название аудиозписи не может быть пустым!", "warning");
        }
    });

    downloadButton.addEventListener("change", (e) => {
        let file = downloadButton.files[0];
        let audioData;
        if (file) {
            let url = URL.createObjectURL(file);
            audioData = {
                title: file.name,
                playlistName: "Не задано",
                userName: "Не задано",
                audio: new Audio(url),
                duration: "Не задано",
                cover: null,
            }
            if (currentAudioData.cover) {
                audioData.cover = currentAudioData.cover;
            }
            audioData.title = audioData.title.split("").reverse().join("").replace(/.+\./gi, "").split("").reverse().join("");
            document.querySelector(".download__info").value = audioData.title;
            audioData.audio.preload = "metadata";
            audioData.audio.addEventListener("loadedmetadata", () => {
                audioData.duration = getTime(audioData.audio.duration);
                player.clear();
                player.add(new AudioObject(audioData));
                player.unblock();
            })
            audioData.audio.addEventListener("load", () => {
                URL.revokeObjectURL(url);
            });

            currentAudioData = audioData;
        }

        document.querySelector(".download__info").addEventListener("change", () => {
            let name = document.querySelector(".download__info");
            let mainName = document.querySelector("#audioName");
            let queueName = document.querySelector(".audio--clickable").querySelector(".audio__name");
            if (name.value == "") {
                currentAudioData.title = name.placeholder;
                mainName.innerText = name.placeholder;
                queueName.innerText = name.placeholder;
            } else {
                currentAudioData.title = name.value;
                mainName.innerText = name.value;
                queueName.innerText = name.value;
            }
            
        });


    });

    changeButton.addEventListener("change", () => {
       
        let file = changeButton.files[0];
        if (file) {
            let url = URL.createObjectURL(file);

            currentAudioData.cover = new Image();
            currentAudioData.cover.src = url;
            document.querySelector(".download__logo").style.backgroundImage = `url("${url}")`;

            currentAudioData.cover.addEventListener("load", () => {
            //   URL.revokeObjectURL(url);
            });

            player.clear();
            player.add(new AudioObject(currentAudioData));
        }
    });   
}