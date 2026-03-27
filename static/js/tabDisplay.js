// Load the tab visually in tab.html
// Import JSON
async function loadTab(id) {
    const response = await fetch(`/riff/${id}`)
    const notes = await response.json()
    renderTab(notes)
}

function renderTab(notes) {
    // Use VexTab to render the tab based on the JSON data
    let barsPerLine = 3; // Default beats per line
    let timeSignature = document.querySelector("#timeSignature").value; // Default time signature
    console.log(timeSignature)
    
    const tabOptions1 = `options space=20 tab-stems=true \n`
    const tabOptions2 = `\n options space=30`

    console.log(notes)
    let noteSection = '';
    let bar;
    let totalCompasses = 1;
    // Convert each line of the tab to the VexTab format, adding bar lines and line breaks as needed
    notes.forEach(note => {
        let tabNoteRhythm = parseInt(note.duration)
        if (note.position % 4 === 0 && note.position !== 0) {
            bar = `|`
            totalCompasses += 1;
        } else {
            bar = ``
        }
        if (totalCompasses > barsPerLine) {
            bar = `\n tabstave time=${timeSignature}/4 \n notes `
            totalCompasses = 1;
        }
        let tabNote = `${note.fret}/${note.string}`
        noteSection += ` ${bar} :${tabNoteRhythm} ${tabNote}`
    });
    console.log(noteSection)

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