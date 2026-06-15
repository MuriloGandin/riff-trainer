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
    const base = tuning[string];
    // Transpose the note a semitone for each fret
    return Tone.Frequency(base).transpose(fret).toNote();
};

// Convert the original array to a Tone.js compatible array
const convertNotes = (notes) => {
    return notes.map(note => ({
        pitch: tabToNote(note.string, note.fret),
        duration: note.duration,
        time: note.position
    }));
};

let previewBpm = 120; // Default value

// Ensure loop flag has a defined initial value
window.loopEnabled = false;

// Update BPM whenever user changes the input
document.querySelector("#bpm")?.addEventListener("change", (e) => {
    let value = parseInt(e.target.value) || 120;
    if (value < 40) {
        value = 40;
    } else if (value > 250) {
        value = 250;
    }
    previewBpm = value;
    e.target.value = value; // Update the input to show the clamped value
});

function durationToBeats(duration) {
    const value = String(duration).trim();
    const triplet = value.endsWith("t");
    const dotted = value.includes(".");
    const match = value.match(/^(\d+)(?:n|t)?(?:\.)?$/);

    if (!match) {
        return 0;
    }

    const denominator = Number(match[1]);
    let beats = 4 / denominator;

    if (triplet) {
        beats /= 1.5; // triplet division: 3 in the time of 2
    }

    if (dotted) {
        beats *= 1.5; // dotted note adds half the value again
    }

    return beats;
}

function calculateTotalTime(notes) {
    let totalTime = 0;
    // Use a Set to track seen positions and avoid double-counting chord notes
    let seemPositions = new Set();

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        if (seemPositions.has(note.time)) {
            // This position has already been counted (chord note), so skip it
            continue;
        }

        seemPositions.add(note.time);

        const beats = durationToBeats(note.duration);
        const durationSeconds = beats * (60 / previewBpm);
        totalTime += durationSeconds;
    }

    return totalTime;
}

// Import JSON file to get each riff's pitch and rhythm
async function loadRiff(id) {
    
    const response = await fetch(`/riff/${id}`);

    const notes = await response.json();

    // At this point, the JSON is loaded

    const converted = convertNotes(notes);

    // IMPORTANT: This global variable contains the total time of the song in seconds, widely used in this and other files
    window.totalPreviewTime = calculateTotalTime(converted);

    return converted;
}

// Initialize the synth outside the player function to avoid creating multiple instances on each play
let synth;
let metronomeId = null;
function riffPlayer(bpm, convertedNotes) {

    // Reset the sequences player's position and clear past scheduled sounds to avoid overlapping
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    Tone.Transport.bpm.value = bpm;

    const secondsPerBeat = 60 / bpm;
    const totalDuration = window.totalPreviewTime; // Assuming this is set in loadRiff

    Tone.Transport.loop = window.loopEnabled;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = totalDuration;

    // Clear any previously scheduled metronome before scheduling a new one
    if (metronomeId !== null) {
        Tone.Transport.clear(metronomeId);
        metronomeId = null;
    }

    if (metronomeEnabled) {
        // Clock sound for the metronome
        const metronome = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 }
        }).toDestination();

        // Schedule repeating metronome clicks
        metronomeId = Tone.Transport.scheduleRepeat((time) => {
                metronome.triggerAttackRelease("C6", "32n", time);
        }, secondsPerBeat);

        if (!window.loopEnabled) {
            Tone.Transport.scheduleOnce(() => {
                if (metronomeId !== null) {
                    Tone.Transport.clear(metronomeId);
                    metronomeId = null;
                }
            }, totalDuration);
        }
      
    }

    convertedNotes.forEach(note => {
        // Convert music notation rhythm to seconds
        const timeInSeconds = secondsPerBeat * note.time;

        Tone.Transport.schedule((time) => {
            synth.triggerAttackRelease(note.pitch, note.duration, time);
        }, timeInSeconds);
    });

    // Wait for cursor and play the result
    window.startCursor();
    Tone.Transport.start();
}

function riffStop () {
    // Pause all sounds and reset transport to avoid overlapping on next play
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
    // Clear metronome if active
    if (metronomeId !== null) {
        Tone.Transport.clear(metronomeId);
        metronomeId = null;
    }
}

let metronomeEnabled = false;
// Toggle metronome on/off
document.querySelector("#metronome")?.addEventListener("change", function() {
    if (this.checked) {
        metronomeEnabled = true;
    } else {
        metronomeEnabled = false;
    }
});

document.querySelector("#preview")?.addEventListener("click", async function() {

    await Tone.start();

    // Handle each of the toggle options
    window.loopEnabled = false;

    let loop = document.querySelector("#loop");
    if (loop.checked) {
        window.loopEnabled = true;
    } else {
        window.loopEnabled = false;
    }

    if (!synth) {
        synth = new Tone.PolySynth().toDestination();
    }
    const id = document.querySelector("#tabId").dataset.id;
    if (id == "inexistent") {
        alert("Preview unavaliable");
        return;
    }
    const converted = await loadRiff(id);

    riffPlayer(previewBpm, converted);
});

document.querySelector("#preview-stop")?.addEventListener("click", () => {
    riffStop();
});