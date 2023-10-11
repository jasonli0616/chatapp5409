import sqlite3
import time

db = sqlite3.connect("chatapp5409.db", check_same_thread=False)
db_cursor = db.cursor()


def create_tables():
    db_cursor.execute("CREATE TABLE IF NOT EXISTS users (ip TEXT PRIMARY KEY, username TEXT)")
    db_cursor.execute("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, text TEXT, time TEXT)")


def create_user(ip, username):
    # Search for existing user with IP
    db_cursor.execute("SELECT * FROM users WHERE ip=?", (ip,))

    if db_cursor.fetchone() == None:
        # Create new user
        db_cursor.execute("INSERT INTO users VALUES (?, ?)", (ip, username))
        db.commit()
    else:
        # Change username of existing user
        db_cursor.execute("UPDATE users SET username=? WHERE ip=?", (username, ip))
        db.commit()


def send_message(ip, message):
    db_cursor.execute("INSERT INTO messages(ip, text, time) VALUES (?, ?, ?)", (ip, message, time.ctime()))
    db.commit()


def get_username(ip):
    db_cursor.execute("SELECT username FROM users WHERE ip=?", (ip,))
    username = db_cursor.fetchone()
    if username:
        return username[0]
    else:
        return None


def get_messages():
    db_cursor.execute("SELECT * FROM messages")
    messages_raw = db_cursor.fetchall()
    messages = []

    for message in messages_raw:
        ip = message[1]
        text = message[2]
        sent_time = message[3]

        messages.append({"ip": ip, "text": text, "time": sent_time})
    
    return messages
