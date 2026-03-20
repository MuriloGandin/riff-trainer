// Convert tablature to tone.js compatible note
const tuning = {
    6: "E2",
    5: "A2",
    4: "D3",
    3: "G3",
    2: "B3",
    1: "E4"
};

const tabToNote = (string, fret) => {

    const base = tuning[string]

    // Transpose the note a semitone for each fret
    return Tone.Frequency(base).transpose(fret).toNote()
}

// Convert the original array to a Tone.js compatible array
const convertNotes = (notes) => {
    return notes.map(note => ({
        pitch: tabToNote(note.string, note.fret),
        duration: note.duration,
        time: note.position
    }))
}

const previewBpm = 120;

function calculateTotalTime(notes) {
    let totalTime = 0;
    notes.forEach(note => {
        const noteValue = parseInt(note.duration);
        const beats = 4 / noteValue;
        const durationSeconds = beats * (60 / previewBpm);
        totalTime += durationSeconds
    });
    return totalTime
}

// Import JSON file to get each riff's pitch and rhythm
async function loadRiff(id) {
    
    const response = await fetch(`/riff/${id}`)

    const notes = await response.json()

    // At this point, the JSON is loaded

    const converted = convertNotes(notes)

    window.totalPreviewTime = calculateTotalTime(converted)
    
    return converted
}

let synth 

function riffPlayer(bpm, convertedNotes) {

    // Reset the sequences player's position
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    Tone.Transport.bpm.value = bpm;

    const secondsPerBeat = 60 / bpm;


    convertedNotes.forEach(note => {
        // Convert music notation rhythm to seconds
        const timeInSeconds = secondsPerBeat * note.time;

        Tone.Transport.schedule((time) => {
            synth.triggerAttackRelease(note.pitch, note.duration, time)
        }, timeInSeconds)
    });

    // Wait for cursor and play the result
    window.startCursor();
    Tone.Transport.start()
}

function riffStop () {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
}


document.querySelector("#preview").addEventListener("click", async function() {

    await Tone.start()


    if(!synth) {
        synth = new Tone.Synth().toDestination()
    }
    const id = document.querySelector("#tabId").dataset.id
    if (id == "inexistent") {
        alert ("Preview unavaliable")
        return
    }
    const converted = await loadRiff(id)

    console.log("audio.js: " + window.totalPreviewTime)


    riffPlayer(previewBpm, converted)
})

document.querySelector("#preview-stop").addEventListener("click", () => {
    riffStop();
})

window.data = {
    notes: "abc",
    time: 123
}