if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".join-button").forEach(button => {
            button.addEventListener("click", function (event) {
                event.preventDefault(); // Stop default button action
                window.open("https://joohugreene.net/4/9026395", "_blank"); // Open the smartlink in a new tab
                window.location.href = this.getAttribute("href"); // Redirect to the actual airdrop link
            });
        });
    });
}