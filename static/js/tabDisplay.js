// Load the tab visually in tab.html
// Import JSON
async function loadTab(id) {
    const response = await fetch(`/riff/${id}`)
    const notes = await response.json()
    renderTab(notes)
}

function renderTab(notes) {
    // Use VexTab to render the tab based on the JSON data
    let tabContent = document.querySelector("#notation");
    let barsPerLine = 3; // Default beats per line
    

    const data = `
options space=20 tab-stems=true \n tabstave time=4/4 \n notes =|: :8$.top.$ 5/6 $∏$ 6/6$V$ 7/6$∏$ 8/5$V$ 5/6$∏$ 6/6$V$ 7/5$∏$ 8/6$V$ | 5/6 $∏$ 6/5$V$ 7/6$∏$ 8/6$V$ 5/5$∏$ 6/6$V$ 7/6$∏$ 8/6$V$ =:| \n options space=30
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