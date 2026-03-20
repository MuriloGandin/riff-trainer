// This file makes the tablature cursor work in sync with the audio

// Initial cursor position

window.addEventListener("load", () => {
    setTimeout(() => {

        let cursorPB = document.querySelector(".playback-cursor");
        let isPlaying = false;

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
        const totalDuration = 4;
        // window.totalPreviewTime
        
        function timeToX(currentTime) {
            const progress = currentTime / totalDuration;
            return startX + progress * tabWidth;
        }

        let animationId;
        function updateCursor() {
            if (!isPlaying) return;

            const currentTime = Tone.Transport.seconds;
            if (currentTime >= totalDuration) {
                stopCursor()
                return
            }

            const x = timeToX(currentTime)
            cursorPB.style.left = `${x}px`;

            animationId = requestAnimationFrame(updateCursor);
        }

        startCursor = function() {
            if (isPlaying) return;

            isPlaying = true;
            requestAnimationFrame(updateCursor)
        }

        document.querySelector("#preview").addEventListener("click", () => {
            updateCursor();
        })

        stopCursor = function() {
            cancelAnimationFrame(animationId);
            cursorPB.style.left = `${startX}px`;
            isPlaying = false;
        }

        let stopButton = document.querySelector("#preview-stop");
        stopButton.addEventListener("click", () => {
            stopCursor();
        })


    }, 100);
});