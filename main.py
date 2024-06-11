import os
import frida
import sys
from pathlib import Path

SCRIPT='hook.js'

def on_detached(args):
    print("Detached from process! You may close this window.")

def on_message(message):
    if (message["type"] == "error"):
        print(message["stack"])
    else:
        print(message["payload"])

def main():
    print("""
-------
Final Fantasy IV Name Fixer 1.0.0
This program will fixes issue with Final Fantasy IV (3D Remake)
on non-Japanese versions of Windows where the character's names are
garbled text (e.g. ƒZƒVƒ‹).
    
Since the names get re-written into memory throughout the game,
please leave the process running while playing.
-------
""")

    try:
        script_file = os.path.join(sys._MEIPASS, SCRIPT) if getattr(sys, 'frozen', False) else SCRIPT
        script_text = Path(script_file).read_text(encoding='utf-8')
        session = frida.attach("FF4.exe")
        script = session.create_script(script_text)
        session.on('detached', on_detached)
        script.on('message', lambda message, data: on_message(message))
        script.load()
        sys.stdin.read()
        session.detach()
    except FileNotFoundError:
        print("ERROR! Could not find hook file! Exiting...")
        sys.stdin.read()
    except frida.ProcessNotFoundError:
        print("ERROR! Could not find Final Fantasy 4 process! Is it running?")
        sys.stdin.read()
    except KeyboardInterrupt:
        session.detach()

if __name__ == "__main__":
    main()