// Load the tab visually in tab.html
// Import JSON
async function loadTab(id) {
    const response = await fetch(`/riff/${id}`)
    const notes = await response.json()
    renderTab(notes)
}

function formatNote(note) {
    let notation = note.notation;

    if (notation === null) notation = "";
    else if (notation === "v") notation = "d";
    else if (notation === "^") notation = "u";

    return `${note.fret}${notation}/${note.string}`;
}

function renderTab(notes) {
    // Use VexTab to render the tab based on the JSON data
    let barsPerLine = 3; // Default beats per line
    let timeSignature = document.querySelector("#timeSignature").value; // Default time signature
    
    const tabOptions1 = `options space=20 tab-stems=true\n`
    const tabOptions2 = `\n options space=50`
    const staveGap = `options space=30 \n`

    let noteSection = '';
    let bar;
    let totalCompasses = 1;
    // Convert each line of the tab to the VexTab format, adding bar lines and line breaks as needed
    
    // Group notes by position to handle chords
    let groupedNotes = {};

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        let pos = note.position;

        if (!groupedNotes[pos]) {
            groupedNotes[pos] = [];
        }

        groupedNotes[pos].push(note);
    }

    // Order the positions to ensure the tab is rendered in the correct sequence
    let positions = Object.keys(groupedNotes)
        .map(Number)
        .sort((a, b) => a - b);
        
    // Loop through the ordered positions to build the tab notation, handling chords and rhythm values
    for (let i = 0; i < positions.length; i++) {

        let pos = positions[i];
        let notesAtPosition = groupedNotes[pos];

        let tabNoteRhythm = parseInt(notesAtPosition[0].duration);

        // Bar lines and line breaks
        if (pos % 4 === 0 && pos !== 0) {
            bar = `|`
            totalCompasses += 1;
        } else {
            bar = ``;
        }

        if (totalCompasses > barsPerLine) {
            bar = `\n ${staveGap} tabstave time=${timeSignature}/4 \n notes `;
            totalCompasses = 1;
        }

        // Variable to handle chords (multiple notes at the same position)
        let chordNotes = notesAtPosition.map(formatNote);

        let tabNote = chordNotes.length > 1
            ? `(${chordNotes.join('.')})`
            : chordNotes[0];

        noteSection += ` ${bar} :${tabNoteRhythm} ${tabNote}`;
    }

    const data = `
    ${tabOptions1} tabstave time=${timeSignature}/4 \n notes =|: ${noteSection} =:| ${tabOptions2}
    `

    const VF = vextab.Vex.Flow

    const renderer = new VF.Renderer($('#notation')[0],
        VF.Renderer.Backends.SVG);

    // Initialize VexTab artist and parser.
    const artist = new vextab.Artist(10, 10, 680, { scale: 1.0 });
    const tab = new vextab.VexTab(artist);

    tab.parse(data);
    artist.render(renderer);
}

document.addEventListener("DOMContentLoaded", () => { 
    loadTab(document.querySelector("#tabId").dataset.id)
})