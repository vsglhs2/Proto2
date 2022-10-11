export class Downloader {
     static async getLibraryDataByUserId(userId) {
        let libraryData = {}, audioData = {};
    
        await this.getUserAudioDataByUserId(userId).then(data => {
            audioData = data;
        });
    
        return { libraryData, audioData };
     }

    static async getUserAudioDataByUserId(userId) {
        if (userId === "-1") return;
        let datau;
        
        let options = {
            method: "GET",
            headers: {
                "Authorization" : `OAuth ${userId}`,
                "Accept" : "application/json",                
                "Content-Type" : "application/json",
            }
        };

        let text, href;
        

        await fetch("https://cloud-api.yandex.net/v1/disk/resources/files?media_type=audio", options).then((res) => res.json()).then((data) => {
            datau = data.items;
        });

        await fetch(`https://cloud-api.yandex.net/v1/disk/resources/download?path=disk:/files.txt`, options).then(res => res.json()).then(data => {   
            href = data.href;
        });  

        fetch(href).then(res => res.text()).then((data) => {
            text = data;
            text = text.split("\n");
            for (let i = 0; i < text.length; i++) {
                text[i] = text[i].split(" ");
            }
        }).then(() => {
            for (let i = 0; i < text.length; i++) {
                fetch(`https://cloud-api.yandex.net/v1/disk/resources/download?path=${"disk:/" + text[i][1]}`, options).then(res => res.json()).then(data => {   
                    let audio = datau.find(elem => elem.name === text[i][0]);
                    if (audio) audio.coverUrl = data.href;
                });  
            }
        });

        for (let i = 0; i < datau.length; i++) {

            await fetch(`https://cloud-api.yandex.net/v1/disk/resources/download?path=${datau[i].path}`, options).then(res => res.json()).then(data => {   
                datau[i].userName = "UserName";
                datau[i].playlistName = "UserName's library";
                if (!datau[i].coverUrl) datau[i].coverUrl = "";
                datau[i].title = datau[i].name;
                datau[i].audioUrl = datau[i].href = data.href; 
            }); 
        }

        return datau;
    }
}


