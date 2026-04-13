from flask import Flask, redirect, render_template, request, jsonify, session
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

    favorites = session.get("favorites", [])

    recent = session.get("recent", [])

    return render_template("index.html", tabInfo=tabInfo, recent=recent, favorites=favorites)

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
        return redirect("/")
    
    if "recent" not in session:
        session["recent"] = []

    if chosen in session["recent"]:
        session["recent"].remove(chosen)

    session["recent"].insert(0, chosen)
    session["recent"] = session["recent"][:5]


    if selectedId in session["favorites"]:
        favorited = True
    else:
        favorited = False

    cursor.close()

    return render_template("tab.html", exercise=chosen, id=selectedId, time_signature=selectedTimeSignature, favorited=favorited)

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

    if int(riff_id) in session["favorites"]:
        session["favorites"].remove(int(riff_id))
        favorited = False
    else:
        session["favorites"].append(int(riff_id))
        favorited = True

    session.modified = True

    return(jsonify({"favorited": favorited}))


# Run app in debug mode
if __name__ == "__main__":
    app.run(debug=True)