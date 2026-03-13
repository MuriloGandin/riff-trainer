document.querySelector("#preview").addEventListener("click", async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();

    Tone.Transport.bpm.value = 120;
    synth.triggerAttackRelease("C4", "8n", now);
});