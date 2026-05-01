# Project - a guitar tablature HTML viewer with integrated MIDI for training

# Context
A tablature is essentially, a musical notation to transcribe guitar riffs, it is a visual representation of the strings and frets of the guitar, where the player can easily understand how to play a song by looking at the position of the notes on the tablature.

A riff is a short, repeated musical phrase, often used in rock and metal music. Riffs are typically played on the guitar and are characterized by their catchy and memorable nature. They can be simple or complex, and they often serve as the foundation for a song's structure.

This project is a web application that allows users to view guitar tablatures and listen to their corresponding MIDI audio (dynamically generated audio). The application is built using Flask for the backend, SQLite for the database, and JavaScript libraries such as Tone.js and VexTab for rendering the tablatures and generating audio. The main goal of this project is to provide a tool for guitar players to learn and practice riffs by visualizing the tablature and hearing the audio simultaneously. Users can select from a collection of riffs stored in the database, view the tablature, and listen to the MIDI audio with options such as a metronome and loop controls to help them learn how to play the riff on their guitar.

## Main structure
### app.py

    This file is the core of the Flask API. It operates by serving data to the other pages,such as forms, JSONs and database rows. 

app.py controls the starting point of the API by fetching entries from riffs.db, it also manages the app routes and methods, making it possible to dynamically load HTML pages based on entries. The aplication data follows the following structure to render and sync tabs:
#### SQLite → Flask → JSON → JavaScript → Tone.js/VexTab
app.py fetches tablature specific info into the JSON format, so it can be accessed within the JavaScript files. In this scenario, the JSON can be converted both into visual VexTab notation and Tone.js auditory output.

This file is also used to manipulate Flask sessions via cookies to store and update info, such as recently accessed pages and favorited tablatures.

### templates / base.html
The basic structure of the pages, base.html contains a mold to be followed by the other pages

#### index.html
The homepage, where the user can access the main functions os the API, such as select and open a tablature

#### tab.html
The tab page renders the VexTab tablature, it also contains the selected's tab audio, which is generated when the page is opened, and preview controls such as a togglable metronome and loop checkbox, as well as a bpm input field to control the playback speed


### static
These are files that shouldn't be altered by Flask, such as stylesheets, images and JavaScript files.

#### styles.css
This is the styles sheet, in charge of the visuals of the API, such as colors, positioning, fonts and alignement. It is used to make the API more visually appealing and user-friendly, as well as to create a consistent design across all pages.

#### img
This folder contains the images used for the visuals of the page

#### audio.js 
This file is responsible for generating the MIDI audio of the selected tablature, it uses Tone.js to create the audio output. the code follows the structure: get JSON for the selected tab > convert atributes to Tone.JS notation > schedule all of converted tab's notes > play the preview when the user clicks a "preview" button. It also contains the code for the metronome, which is a simple loop that plays a click sound at the selected BPM, it can be toggled on and off by the user. By dividing the audio generation and tablature rendering into two separate files, it allows for better organization and separation of concerns, making the code easier to maintain and understand. This way, any changes or updates to the audio generation logic can be made in audio.js without affecting the tablature rendering logic in tabDisplay.js, and vice versa.

#### tabDisplay.js
This file is responsible for effectively rendering the tablature by converting the notes data from the database to VexTab notation. It also uses the JSON data of each note to add dynamic styling to the tablature, such as rhythm, pitch and notation styling. The code uses the VexTab library, so most of its syntax is based on VexTab syntax.

#### cursorSync.js
This file renders and updates the playback cursor in sync with the selected BPM, this helps in providing a visual indication of the current playback position. Each JS function serves a different usage for the cursor, such as updating the cursor position based on the current time of the audio playback, or resetting the cursor to the starting position when the audio is stopped or looped. By keeping the cursor synchronization logic in a separate file, it allows for better organization and separation of concerns. This way, any changes or updates to the cursor synchronization logic can be made in cursorSync.js without affecting the audio generation logic in audio.js or the tablature rendering logic in tabDisplay.js.

#### visuals.js
This aditional script file is used mainly for DOM managing and dynamic styling, such as formating text, changing icons and managing the visibility of elements. It is a separaded file to keep the code organized and to avoid cluttering the other files with DOM manipulation code, which is essentialy more simple than the audio generation and tablature rendering logic, but still important for the user experience of the API.

### riffs.db
The project's database is where the tablatures are stored, as well as important information such as time signatures, naming and notes rhythm and pitch. It is useful for any information that needs to be persistent. The database is structured in a way that allows for easy retrieval of tablature information, which is essential for rendering the tablatures and generating the audio output. The database can be easily updated with new tablatures or modified with existing ones, making it a flexible and efficient way to manage the tablature data for the application.

### noteinsert.py
This is a helper script, it is used to make it easier to insert new tablatures into the database. It supports notation for articulations, muting, and picking styles, which are important for accurately representing the nuances of guitar playing in the tablature. The script takes a JSON file as input, which contains the information about the riff, such as its name, time signature, and notes. The script then processes this information and inserts it into the database in the correct format. Initially, the database inserts were made manually, but as the project grew, it became clear that a more efficient way to manage the tablature data was needed, which led to the development of this helper script. By using this script, it allows for faster and more accurate insertion of new tablatures into the database, which is essential for keeping the application up-to-date with new riffs and exercises.
By using the argparse library, the script can be run from the command line, making it easy to use and integrate into a workflow for managing the tablature data.

Usage:
- To insert a new riff: `python scripts/noteinsert.py --json_file path/to/riff.json`
- To update notation for existing notes: `python scripts/noteinsert.py --json_file path/to/riff.json --update`
The JSON file should have the structure:
{
    "name": "riff_name",
    "time_signature": "4/4",
    "difficulty": "beginner/intermediate/advanced",
    "notes": [
        {"string": 6, "fret": 5, "position": 0.0, "duration": "8n", "notation": "downstroke"},
        ...
    ]
}

The JSON files used are stored in scripts/jsonFiles
