window.addEventListener("load", () => {
    setTimeout(() => {

        let cursorPB = document.querySelector(".playback-cursor");

        const container = document.querySelector(".tab-container");
        const containerRect = container.getBoundingClientRect();

        const tabElement = document.querySelector("#notation canvas, #notation svg");
        const rect = tabElement.getBoundingClientRect();

        const startX = rect.left - containerRect.left;
        console.log("startX:", startX);
        cursorPB.style.left = `${startX}px`;

    }, 100);
});