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
    tabContent.innerHTML = "test"
    
}

document.addEventListener("DOMContentLoaded", () => { 
    loadTab(document.querySelector("#tabId").dataset.id)
})