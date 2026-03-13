# The purpose of this file is to have an easier way of inserting new tablatures into the database
import sqlite3

conn = sqlite3.connect("riffs.db")
cursor = conn.cursor()

riff_name = "sweep"
tempo = "100"
compass = "3/3"

cursor.execute(
    """
    INSERT INTO riffs (name, tempo, time_signature)
    VALUES (?, ?, ?)
    """, (riff_name, tempo, compass)
)

riff_id = cursor.lastrowid

riff_notes = [
    (5, 10),
    (4, 9),
    (3, 8),
    (2, 7),
    (3, 8),
    (4, 9)
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