from flask import Flask, render_template, request, jsonify
import sqlite3

conn = sqlite3.connect("riffs.db")
cursor = conn.cursor()

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/tab", methods=["POST"])
def tab():

    chosen = request.form.get("tab")

    conn = sqlite3.connect("riffs.db")
    cursor = conn.cursor()

    try:
        selectedId = cursor.execute(
            """
            SELECT id
            FROM riffs
            WHERE name LIKE ?
            """, (chosen,)).fetchone()[0]
        
        selectedTimeSignature = cursor.execute(
            """
            SELECT time_signature
            FROM riffs
            WHERE name LIKE ?
            """, (chosen,)).fetchone()[0]
        
    except TypeError:
        selectedId = "inexistent"
        selectedTimeSignature = "inexistent"

    cursor.close()


    return render_template("tab.html", exercise=chosen, id=selectedId, time_signature=selectedTimeSignature)

@app.route("/riff/<int:riff_id>")
def get_riff(riff_id):
    
    conn = sqlite3.connect("riffs.db")
    cursor = conn.cursor()

    # Get all of the selected riff's notes
    notes = cursor.execute(
    """
    SELECT string, fret, duration, position
    FROM notes
    WHERE riff_id = ?
    ORDER BY position
    """, (riff_id,)).fetchall()

    conn.close()

    # Create a list to populate in JSON format
    notes_list = []

    for note in notes:
        notes_list.append({
            "string": note[0],
            "fret": note[1],
            "duration": note[2],
            "position": note[3]
        })

    return jsonify(notes_list)

# Run app in debug mode
if __name__ == "__main__":
    app.run(debug=True)