# Project - a guitar tablature html viewer with integrated MIDI for training

## Main structure
### app.py

#### SQLite → Flask → JSON → JavaScript → Tone.js

### templates
### static
#### audio.js 
Structure: get JSON for the selected tab > convert atributes to Tone.JS notation > schedule all of converted tab's notes > play the preview when the user clicks a "preview" button
### riffs.db
### noteinsert.py
