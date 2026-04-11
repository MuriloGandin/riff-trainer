from flask import Flask, render_template, request, jsonify, session
import sqlite3

conn = sqlite3.connect("riffs.db")
cursor = conn.cursor()

app = Flask(__name__)
app.secret_key = "oksdokSVMoDgeior12fsa232"

@app.route("/", methods=["GET", "POST"])
def index():

    if "recent" not in session:
        session["recent"] = []

    if "favorites" not in session:
        session["favorites"] = []

    conn = sqlite3.connect("riffs.db")
    cursor = conn.cursor()

    tabInfo = cursor.execute(
        """
        SELECT name, dificulty
        FROM riffs
        """).fetchall()

    return render_template("index.html", tabInfo=tabInfo, recent=session.get("recent", []))

@app.route("/tab", methods=["POST"])
def tab():

    if "recent" not in session:
        session["recent"] = []

    chosen = request.form.get("tab")
    
    if chosen in session["recent"]:
            session["recent"].remove(chosen)

    session["recent"].insert(0, chosen)
    session["recent"] = session["recent"][:5]

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
    SELECT string, fret, duration, position, notation
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
            "position": note[3],
            "notation": note[4]
        })

    return jsonify(notes_list)

@app.route("/toggle-favorite", methods=["POST"])
def toggle_favorite():
    riff_id = str(request.json.get("riff_id"))

    if "favorites" not in session:
        session["favorites"] = []

    if riff_id in session["favorites"]:
        session["favorites"].remove(riff_id)
        favorited = False
    else:
        session["favorites"].append(riff_id)
        favorited = True

    session.modified = True
    print(session["favorites"])

    return(jsonify({"favorited": favorited}))


# Run app in debug mode
if __name__ == "__main__":
    app.run(debug=True)