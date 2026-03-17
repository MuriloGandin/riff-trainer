# The purpose of this file is to have an easier way of inserting new tablatures into the database
import sqlite3

conn = sqlite3.connect("riffs.db")
cursor = conn.cursor()

riff_name = "alternate"
tempo = "100"
compass = "4/4"

cursor.execute(
    """
    INSERT INTO riffs (name, tempo, time_signature)
    VALUES (?, ?, ?)
    """, (riff_name, tempo, compass)
)

riff_id = cursor.lastrowid

# Format: (string, fret)
riff_notes = [
    (6, 5),
    (6, 6),
    (6, 7),
    (5, 8),
    (6, 5),
    (6, 6),
    (5, 7),
    (6, 8),
    (6, 5),
    (5, 6),
    (6, 7),
    (6, 8),
    (5, 5),
    (6, 6),
    (6, 7),
    (6, 8)
]

beat_position = 0
step = 0.5

for string, fret in riff_notes:

    cursor.execute(
    """
    INSERT INTO notes (riff_id, string, fret, position, duration)
    VALUES (?, ?, ?, ?, ?)
    """, (riff_id, string, fret, beat_position, "8n")
    )
    beat_position += step

conn.commit()
conn.close()