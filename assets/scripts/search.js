window.addEventListener("load", function() {
    let contextSearchButton = document.querySelector("#contextSearchButton");
    contextSearchButton.addEventListener("click", () => {
        if (contextSearchButton.src == "http://127.0.0.1:5500/assets/images/icons/check.svg") { 
            contextSearchButton.src = "http://127.0.0.1:5500/assets/images/icons/clear.svg";
        }
        else {
            contextSearchButton.src = "http://127.0.0.1:5500/assets/images/icons/check.svg";
        }
    });

    let searchButton = document.querySelector("#searchButton");
    searchButton.addEventListener("click", () => {
        searchButton.querySelector("#search").style.display = "flex";
        document.addEventListener("mouseup", (e) => {
            if (e.currentTarget != search) searchButton.querySelector("#search").style.display = null;
        });
    });
});

