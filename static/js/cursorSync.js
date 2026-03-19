// This file makes the tablature cursor work in sync with the audio

// Initial cursor position

window.addEventListener("load", () => {
    setTimeout(() => {

        let cursorPB = document.querySelector(".playback-cursor");

        const container = document.querySelector(".tab-container");
        const containerRect = container.getBoundingClientRect();

        const tabElement = document.querySelector("#notation");
        const rect = tabElement.getBoundingClientRect();

        const startX = rect.left - containerRect.left + 50;
        console.log("startX:", startX);
        cursorPB.style.left = `${startX}px`;

        // Defines the allowed position for cursor
        const tabWidth = tabElement.clientWidth;
        const endX = startX + tabWidth;

        // PLACEHOLDER
        const totalDuration = 20;

        function timeToX(currentTime) {
            const progress = currentTime / totalDuration;
            return startX + progress * tabWidth;
        }

        function updateCursor() {
            const currentTime = Tone.Transport.seconds;

            const x = timeToX(currentTime)
            cursorPB.style.left = `${x}px`;

            requestAnimationFrame(updateCursor)
        }

        document.querySelector("#preview").addEventListener("click", () => {
            console.log("Cursor active")
            updateCursor();
        })


    }, 100);
});