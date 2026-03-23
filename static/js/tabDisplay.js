// Load the tab visually in tab.html
// Import JSON
async function loadTab(id) {
    const response = await fetch(`/riff/${id}`)
    const notes = await response.json()
    renderTab(notes)
}

function renderTab(notes) {
    // console.log("Notes data:", notes);
}

document.addEventListener("DOMContentLoaded", () => { 
    loadTab(document.querySelector("#tabId").dataset.id)
})