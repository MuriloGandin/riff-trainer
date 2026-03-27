# Project - a guitar tablature HTML viewer with integrated MIDI for training

## Main structure
### app.py

    This file is the core of the Flask API. It operates by serving data to the other pages,such as forms, JSONs and database rows. 

app.py controls the starting point of the API by fetching entries from riffs.db, it also manages the app routes and methods, making it possible to dynamically load HTML pages based on entries. The aplication data follows the following structure to render and sync tabs:
#### SQLite → Flask → JSON → JavaScript → Tone.js/VexTab
app.py fetches tablature specific info into the JSON format, so it can be accessed within the JavaScript files. In this scenario, the JSON can be converted both into visual VexTab notation and Tone.js auditive output.

### templates
The basic structure of the pages

#### index.html
The homepage, where the user can access the main functions os the API, such as select and open a tablature

#### tab.html
The tab page render the VexTab tablature, it also contains the selected's tab audio, which is generated when the page is opened


### static
These are files that shouldn't be altered by Flask

#### styles.css
This is the styles sheet, encharged of the visuals of the API, such as colors, positioning, fonts and alignement

#### audio.js 
Structure: get JSON for the selected tab > convert atributes to Tone.JS notation > schedule all of converted tab's notes > play the preview when the user clicks a "preview" button

#### tabDisplay.js
This file is responsible for effectively rendering the tablature by converting the notes data from de database to VexTab notation.

#### cursorSync.js
This file renders and updates the playback cursor in sync with the selected BPM. Each JS function serves a different usage for the cursor
- initCursor: 
- timeToXY:
- updateCursor:
- startCursor:
- stopCursor:

### riffs.db
The project's database is where the tablatures are stored, as well as important information such as time signatures, naming and notes rhythm and pitch. It is useful for any information that needs to be persistent.

### noteinsert.py
This is a helper script, it is used to make it easier to insert new tablatures into the database. It supports notation for articulations, muting, and picking styles.

Usage:
- To insert a new riff: `python scripts/noteinsert.py --json_file path/to/riff.json`
- To update notation for existing notes: `python scripts/noteinsert.py --json_file path/to/riff.json --update`

The JSON file should have the structure:
{
    "name": "riff_name",
    "time_signature": "4/4",
    "notes": [
        {"string": 6, "fret": 5, "position": 0.0, "duration": "8n", "notation": "downstroke"},
        ...
    ]
}
