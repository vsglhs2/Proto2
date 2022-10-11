window.onload = function() {
    const exitButton = document.querySelector("#exitButton");
    exitButton.addEventListener("click", () => {
        localStorage.setItem("userId", -1);
        location.reload();
    });
}