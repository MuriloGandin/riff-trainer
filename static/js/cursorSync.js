// This file makes the tablature cursor work in sync with the audio

window.addEventListener("load", () => {

        let cursorPB = document.querySelector(".playback-cursor");
        let isPlaying = false;

        const container = document.querySelector(".tab-container");
        const tabElement = document.querySelector("#notation");

        // Initial cursor position and tab dimensions
        let startX, startY, tabWidth, endX, staveMap;

        function initCursor() {
            // Ensures the cursor is positioned correctly relative to the tab, even on window resize
            if (container && tabElement) {
            const containerRect = container.getBoundingClientRect();
            const rect = tabElement.getBoundingClientRect();


            startX = rect.left - containerRect.left + 50;
            startY = rect.top - containerRect.top + 77;

            // Defines the allowed position for cursor
            tabWidth = tabElement.clientWidth - 70;
            endX = startX + tabWidth;


            // store Y positions of staves and the total of staves in an array of objects
            const staves = document.querySelectorAll("#notation svg .vf-stave")
            staveMap = Array.from(staves).map((stave, index) => {
                const staveRect = stave.getBoundingClientRect();
                return {
                    index: index,
                    yPos: staveRect.top - containerRect.top,
                }
            });

            // Reset cursor position
            cursorPB.style.left = `${startX}px`;
            cursorPB.style.top = `${startY}px`;
        }
    }

        function waitForTab() {
            const staves = document.querySelectorAll("#notation svg .vf-stave");

            if (staves.length === 0 || tabElement.clientWidth === 0) {
                requestAnimationFrame(waitForTab);
                return;
            }

            initCursor();
        }

        waitForTab(); // Initial calculation

        // Recalculate on window resize
        window.addEventListener('resize', initCursor);

        // Get x and y position of the cursor based on the current time of the audio
        function timeToXY(currentTime) {
            totalTime = window.totalPreviewTime;
            totalStaves = staveMap.length;
            timePerLine = totalTime / totalStaves;
            currentLineTime = currentTime % timePerLine;
            let currentLineIndex = Math.floor(currentTime / timePerLine);

            if (totalStaves > 1) {
                // Calculate the gap between staves using the first two staves in the staveMap
                staveGap = staveMap[1].yPos - staveMap[0].yPos;
            }


            if (currentLineIndex === 0) {
                y = startY;
            } else {
                // This formula calculates the resulting Y position based on the current line index and the gap between staves
                y = startY + staveGap * currentLineIndex;
            }

            const progress = currentLineTime / timePerLine;
            const x = Math.round(startX + progress * tabWidth);
            return {x, y};
        }

        let animationId;
        function updateCursor() {
            if (!isPlaying) return;

            let currentTime = Tone.Transport.seconds;

            if (window.loopEnabled) {
                currentTime = currentTime % window.totalPreviewTime;
            } else {
                if (currentTime >= window.totalPreviewTime) {
                    stopCursor()
                    return
                }
            }

            const {x, y} = timeToXY(currentTime)

            cursorPB.style.transform = `translateX(${x-startX}px)`;
            cursorPB.style.top = `${y}px`;

            // Request the next frame to keep the animation going
            animationId = requestAnimationFrame(updateCursor);
        }

        startCursor = function() {
            if (isPlaying) return;

            isPlaying = true;

            requestAnimationFrame(updateCursor)
        }

        stopCursor = function() {
            // Stop the animation and reset the cursor position
            cancelAnimationFrame(animationId);
            cursorPB.style.left = `${startX}px`;
            cursorPB.style.top = `${startY}px`;
            isPlaying = false;
        }

        let stopButton = document.querySelector("#preview-stop");
        if (stopButton) {
        stopButton.addEventListener("click", () => {
            stopCursor();
        })
    }

});
