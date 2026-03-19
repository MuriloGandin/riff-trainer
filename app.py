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
        
    except TypeError:
        selectedId = "inexistent"

    cursor.close()

    tabs = {
        "alternate": "options space=20 tab-stems=true \n tabstave time=4/4 \n notes =|: :8$.top.$ 5/6 $∏$ 6/6$V$ 7/6$∏$ 8/5$V$ 5/6$∏$ 6/6$V$ 7/5$∏$ 8/6$V$ | 5/6 $∏$ 6/5$V$ 7/6$∏$ 8/6$V$ 5/5$∏$ 6/6$V$ 7/6$∏$ 8/6$V$ =:| \n options space=30",
        "sweep": "options space=20 tab-stems=true \n tabstave time=3/4 \n notes =|: :8$.top.$ 10/5$∏$ 9/4$∏$ 8/3$∏$ 7/2$V$ 8/3$V$ 9/4$V$ =:| \n options space=30",
        "spider": "options space=20 tab-stems=true \n tabstave time=4/4 \n notes :8 5-7-6-8/6 5-6-7-8/5|5-7-6-8/4 5-6-7-8/3|5-7-6-8/2 5-6-7-8/1 \n tabstave time=4/4 \n notes :8 5-7-6-8/1 5-6-7-8/2|5-7-6-8/3 5-6-7-8/4|5-7-6-8/5 5-6-7-8/6 \n options space=20"
    }
    selected = tabs[chosen]

    print(selectedId)
    return render_template("tab.html", tab=selected, exercise=chosen, id=selectedId)

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