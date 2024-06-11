import hashlib
import shutil
import os.path

BINARY = "FF4.exe"
BACKUP = "FF4.exe.original"

CLEAN_MD5 = '5e99f20da944094cbc8d7c4be4df834e'
PATCH_MD5 = 'cd9799181ba35a2a3d80291b43538eda'

def md5sum(filename):
    with open(filename, 'rb', buffering=0) as fd:
        return hashlib.file_digest(fd, 'md5').hexdigest()

def wait(code):
    try:
        input("Press Enter to exit...\n")
    except KeyboardInterrupt:
        pass
    finally:
        exit(code)

if not os.path.exists(BINARY):
    print(f"Could not find {BINARY}! Are you running this from the correct directory?")
    wait(1)

clean_md5 = md5sum(BINARY)
if clean_md5 == PATCH_MD5:
    print(f"Patch has already been applied! File will not be modified.")
    wait(1)

if clean_md5 != CLEAN_MD5:
    print(f"ERROR: {BINARY} has unexpected contents! Expected file hash {CLEAN_MD5} but got {clean_md5}.")
    wait(1)

try:
    print(f"Backing up {BINARY} to {BACKUP}...")
    # Move the original and copy it back to keep
    # from modifying the attributes of the backup
    shutil.move(BINARY, BACKUP)
    shutil.copy(BACKUP, BINARY)
except PermissionError as e:
    print(f"ERROR: Could not backup {BINARY}! Ensure the game is currently not running and the file is not open in any other applications.")
    wait(1)

print(f"Patching {BINARY}...")
with open(BINARY, "r+b", buffering=0) as fd:
    # push 00 => jmp 66
    fd.seek(0x2C089)
    fd.write(b'\xEB\x66')

    # push 000003a4
    # jmp  93
    fd.seek(0x2C0F1)
    fd.write(b'\x68\xA4\x03\x00\x00\xEB\x93')

    # push 00 => jmp 2a
    fd.seek(0x2C0CC)
    fd.write(b'\xEB\x2A')

    # push 000003a4
    # jmp  cf
    fd.seek(0x2C0F8)
    fd.write(b'\x68\xA4\x03\x00\x00\xEB\xCF')

patch_md5 = md5sum(BINARY)
if patch_md5 != PATCH_MD5:
    print(f"ERROR: Patching the file was unsuccessful! Restoring backup...")
    shutil.move(BACKUP, BINARY)
    wait(1)

print(f"Successfully patched {BINARY}!")
wait(0)
