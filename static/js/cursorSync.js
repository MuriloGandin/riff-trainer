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
        cursorPB.style.left = `${startX}px`;
        const startY = rect.top - containerRect.top + 70;
        cursorPB.style.top = `${startY}px`;

        // Defines the allowed position for cursor
        const tabWidth = tabElement.clientWidth - 70;
        const endX = startX + tabWidth;
        
      
        // store Y positions of staves and the total of staves in an array of objects
        const staves = document.querySelectorAll("#notation svg .vf-stave")
        const staveMap = Array.from(staves).map((stave, index) => {
            const staveRect = stave.getBoundingClientRect();
            return {
                index: index,
                yPos: staveRect.top - containerRect.top,
            }
        })

        // Get x and y position of the cursor based on the current time of the audio
        function timeToXY(currentTime) {
            totalTime = window.totalPreviewTime;
            totalStaves = staveMap.length;
            timePerLine = totalTime / totalStaves;
            currentLineTime = currentTime % timePerLine;
            let currentLineIndex = Math.floor(currentTime / timePerLine);
            
            if (totalStaves > 1) {
                staveGap = staveMap[1].yPos - staveMap[0].yPos;
            }
            
            
            if (currentLineIndex === 0) {
                y = startY;
            } else {
                y = startY + staveGap * currentLineIndex;
            }

            const progress = currentLineTime / timePerLine;
            const x = startX + progress * tabWidth;
            return {x, y};
        }

        let animationId;
        function updateCursor() {
            if (!isPlaying) return;

            const currentTime = Tone.Transport.seconds;
            if (currentTime >= window.totalPreviewTime) {
                stopCursor()
                return
            }

            const {x, y} = timeToXY(currentTime)
            cursorPB.style.left = `${x}px`;
            cursorPB.style.top = `${y}px`;

            animationId = requestAnimationFrame(updateCursor);
        }

        startCursor = function() {
            if (isPlaying) return;

            isPlaying = true;
            requestAnimationFrame(updateCursor)
        }

        // linebreak for the cursor
        // Query staves
        // Get Y positions and calculate time ranges


        document.querySelector("#preview").addEventListener("click", () => {
            updateCursor();
        })

        stopCursor = function() {
            cancelAnimationFrame(animationId);
            cursorPB.style.left = `${startX}px`;
            cursorPB.style.top = `${startY}px`;
            isPlaying = false;
        }

        let stopButton = document.querySelector("#preview-stop");
        stopButton.addEventListener("click", () => {
            stopCursor();
        })

    }, 100);
});