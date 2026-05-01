# The purpose of this file is to have an easier way of inserting new tablatures into the database
import sqlite3
import argparse
import json

def insert_riff_and_notes(riff_data):
    conn = sqlite3.connect("riffs.db")
    cursor = conn.cursor()

    # Insert riff
    cursor.execute(
        """
        INSERT INTO riffs (name, time_signature, difficulty)
        VALUES (?, ?, ?)
        """, (riff_data['name'], riff_data['time_signature'], riff_data['difficulty'])
    )

    riff_id = cursor.lastrowid

    # Insert notes
    for note in riff_data['notes']:
        cursor.execute(
            """
            INSERT INTO notes (riff_id, string, fret, position, duration, notation)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (riff_id, note['string'], note['fret'], note['position'], note['duration'], note.get('notation', ''))
        )

    conn.commit()
    conn.close()
    print(f"Inserted riff '{riff_data['name']}' with {len(riff_data['notes'])} notes.")

def update_notation_for_existing_riff(riff_name, notes_with_notation):
    conn = sqlite3.connect("riffs.db")
    cursor = conn.cursor()

    # Get riff_id
    cursor.execute("SELECT id FROM riffs WHERE name = ?", (riff_name,))
    result = cursor.fetchone()
    if not result:
        print(f"Riff '{riff_name}' not found.")
        conn.close()
        return
    riff_id = result[0]

    # Update notes
    for note in notes_with_notation:
        cursor.execute(
            """
            UPDATE notes
            SET notation = ?
            WHERE riff_id = ? AND string = ? AND fret = ? AND position = ?
            """, (note['notation'], riff_id, note['string'], note['fret'], note['position'])
        )

    conn.commit()
    conn.close()
    print(f"Updated notation for {len(notes_with_notation)} notes in riff '{riff_name}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Insert or update riffs and notes in the database.")
    parser.add_argument('--json_file', required=True, help='Path to JSON file with riff data')
    parser.add_argument('--update', action='store_true', help='Update notation for existing riff instead of inserting new')

    args = parser.parse_args()

    with open(args.json_file, 'r') as f:
        riff_data = json.load(f)

    if args.update:
        update_notation_for_existing_riff(riff_data['name'], riff_data['notes'])
    else:
        insert_riff_and_notes(riff_data)