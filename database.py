import sqlite3
import time

db = sqlite3.connect("chatapp5409.db")
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
        raise KeyError("User with IP Address %s not found." % ip)


def get_messages():
    db_cursor.execute("SELECT * FROM messages")
    messages_raw = db_cursor.fetchall()
    messages = []

    for message in messages_raw:
        ip = message[1]
        text = message[2]
        sent_time = message[3]

        messages.append(Message(ip, text, sent_time))
    
    return messages


class Message:
    def __init__(self, ip, message, sent_time) -> None:
        self.__ip = ip
        self.__message = message
        self.__time = sent_time
    
    def get_username(self):
        return get_username(self.__ip)
    
    def get_message(self):
        return self.__message
    
    def get_time(self):
        return self.__time
    
    def __repr__(self) -> str:
        return self.get_message()