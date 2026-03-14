// Convert tablature to tone.js compatible note
const tuning = {
    6: "E2",
    5: "A2",
    4: "D3",
    3: "G3",
    2: "B3",
    1: "E4"
};

function tabToNote (string, fret) {

    const base = tuning[string]

    // Transpose the note a semitone for each fret
    return Tone.Frequency(base).transpose(fret).toNote()
}

// Convert the original array to a Tone.js compatible array
function convertNotes(notes) {
    return notes.map(note => ({
        pitch: tabToNote(note.string, note.fret),
        duration: note.duration,
        time: note.position
    }))
}

// Import JSON file to get each riff's pitch and rhythm
async function loadRiff(id) {
    
    const response = await fetch(`/riff/${id}`)

    const notes = await response.json()

    console.log("loaded")


    const converted = convertNotes(notes)

    console.log(converted)
}
loadRiff(1)