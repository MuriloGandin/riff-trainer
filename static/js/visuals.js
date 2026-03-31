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