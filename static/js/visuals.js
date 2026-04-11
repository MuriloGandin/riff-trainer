document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector("#searchInput");
    const riffList = document.querySelectorAll(".riff-item");

    search.addEventListener("input", function() {
        const value = this.value.toLowerCase();

        riffList.forEach(riff => {
            const text = riff.textContent.toLowerCase();

            if (text.includes(value)) {
                riff.style.display = "";
            } else {
                riff.style.display = "none";
            }
        });
    });
})


// Format riff names for display
function formatRiffName(name) {
    return name
    // CamelCase to normal
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Capitalize first letter of each word
    .replace(/\b\w/g, char => char.toUpperCase())
    // Separate words followed by numbers
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    // Replace underscores with spaces
    .replace(/_/g, ' ');
}

const riffButtons = document.querySelectorAll(".riff-item button .riff-name");

riffButtons.forEach(button => {
    const originalText = button.innerText;
    const formattedText = formatRiffName(originalText);

    button.innerText = formattedText;
});

document.addEventListener("DOMContentLoaded", () => {
    const tabTitle = document.querySelector(".tab-title");
    if (tabTitle) {
        const originalText = tabTitle.textContent;

        tabTitle.textContent = formatRiffName(originalText);
    }

    const favoriteIcon = document.querySelector(".star-icon")
    if (!favoriteIcon) return;
    favoriteIcon.addEventListener("click", async () => {
        const riffId = favoriteIcon.dataset.id

        const response = await fetch("/toggle-favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ riff_id: riffId })
    });
    
        const data = await response.json()

        if (data.favorited) {
            favoriteIcon.src = favoriteIcon.dataset.filled
        } else {
            favoriteIcon.src = favoriteIcon.dataset.empty
        }
    })
})

