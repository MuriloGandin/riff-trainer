# The purpose of this file is to have an easier way of inserting new tablatures into the database
import sqlite3

conn = sqlite3.connect("riffs.db")
cursor = conn.cursor()

riff_name = "spider" # Change this to the name of the riff you want to insert
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
    (6, 7),
    (6, 6),
    (6, 8),
    (5, 5),
    (5, 6),
    (5, 7),
    (5, 8),
    (4, 5),
    (4, 7),
    (4, 6),
    (4, 8),
    (3, 5),
    (3, 6),
    (3, 7),
    (3, 8),
    (2, 5),
    (2, 7),
    (2, 6),
    (2, 8),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8),
    (1, 5),
    (1, 7),
    (1, 6),
    (1, 8),
    (2, 5),
    (2, 6),
    (2, 7),
    (2, 8),
    (3, 5),
    (3, 7),
    (3, 6),
    (3, 8),
    (4, 5),
    (4, 6),
    (4, 7),
    (4, 8),
    (5, 5),
    (5, 7),
    (5, 6),
    (5, 8),
    (6, 5),
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