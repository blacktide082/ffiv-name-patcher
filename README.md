# Final Fantasy IV Name Fixer

This program fixes character names in Final Fantasy IV (3D Remake) when playing in Japanese on a non-Japanese version of Windows

Without using this, the character's names show as jumbled text in the game:

![](./images/screenshot.png)

## Instructions

- Launch Final Fantasy IV (ensure the game is running, not just the launcher).
- Run the `ffiv-name-fixer.exe` executable.
- Leave it running in the background while playing.

## Running

You can download a pre-built executable from the [latest release](https://github.com/blacktide082/ffiv-name-fixer).

If you want to run it yourself, you can do so with the following commands (tested on Python 3.10):

```batch
pip install frida
python .\main.py
```

## Building

To build the program into a single executable, run the `build.bat` file:

```batch
.\build.bat
```