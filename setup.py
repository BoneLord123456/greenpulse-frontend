import subprocess
import shlex
from pathlib import Path

PROJECT = Path.home() / "Downloads" / "GreenPulse Project"


def open_terminal(command):
    subprocess.Popen([
        "kitty",
        "--",
        "fish",
        "-c",
        command
    ])


# =========================================================
# CHECK PROJECT
# =========================================================

if not PROJECT.is_dir():
    print()
    print("ERROR: GreenPulse Project was not found.")
    print()
    print(f"Expected location:")
    print(PROJECT)
    print()
    input("Press Enter to exit...")
    raise SystemExit(1)


# Safely quote the path for Fish
PROJECT = shlex.quote(str(PROJECT))


# =========================================================
# INSTALL SYSTEM REQUIREMENTS
# =========================================================

print()
print("Installing required system packages your beloved Greenpulse Project...")
print()

subprocess.run([
    "sudo",
    "pacman",
    "-S",
    "--needed",
    "python313",
    "nodejs",
    "npm",
    "kitty",
    "libnotify",
    "fish"
], check=True)


# =========================================================
# ML BACKEND
# =========================================================

open_terminal(f"""
cd -- {PROJECT}/pollution_backend || exit 1

echo
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo "Setting up ML Backend..."
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo

if not test -d .venv
    echo "Creating Python 3.13 virtual environment..."
    python3.13 -m venv .venv
end

source .venv/bin/activate.fish

echo
echo "Python version:"
python --version
echo

echo "Installing Python requirements..."
python -m pip install --upgrade pip
pip install -r requirements.txt

echo
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo "ML Backend setup complete!"
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo
echo "Starting ML Backend..."
echo

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

exec fish
""")


# =========================================================
# GREENPLUS HERO PAGE
# =========================================================

open_terminal(f"""
cd -- {PROJECT}/GreenPlus-main || exit 1

echo
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo " Setting up GreenPulse Hero Page..."
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo

cd ~/Downloads/"GreenPulse Project"/greenpulse
rm -rf node_modules
npm install

echo
echo "GreenPlus setup complete."
echo
echo "Starting the Hero Page..."
echo

npm run dev

exec fish
""")


# =========================================================
# GREENPULSE DASHBOARD
# =========================================================

open_terminal(f"""
cd -- {PROJECT}/greenpulse || exit 1

echo
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo " Setting up GreenPulse Dashboard"
echo "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"
echo

cd ~/Downloads/"GreenPulse Project"/GreenPlus-main
rm -rf node_modules
npm install

echo
echo "GreenPulse setup complete."
echo
echo "Starting the Dashboard..."
echo

npm run dev

exec fish
""")


# =========================================================
# CREATE START SCRIPT
# =========================================================

real_project = str(Path.home() / "Downloads" / "GreenPulse Project")
quoted_project = shlex.quote(real_project)

start_script = Path(real_project) / "start_greenpulse.py"

start_code = f'''import subprocess
import time

PROJECT = {real_project!r}


def open_terminal(command):
    subprocess.Popen([
        "kitty",
        "--",
        "fish",
        "-c",
        command
    ])


# ML Backend
open_terminal(f"""
cd -- {quoted_project}/pollution_backend || exit 1

echo
echo "Starting ML Backend..."
echo

source .venv/bin/activate.fish

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

exec fish
""")


# GreenPlus Hero Page
open_terminal(f"""
cd -- {quoted_project}/GreenPlus-main || exit 1

echo
echo "Starting GreenPulse Hero Page..."
echo

npm run dev

exec fish
""")


# GreenPulse Dashboard
open_terminal(f"""
cd -- {quoted_project}/greenpulse || exit 1

echo
echo "Starting GreenPulse Dashboard..."
echo

npm run dev

exec fish
""")


time.sleep(5)

subprocess.Popen([
    "notify-send",
    "GreenPulse Started",
    "All GreenPulse servers have been started."
])
'''

start_script.write_text(start_code, encoding="utf-8")


# =========================================================
# DONE
# =========================================================

print()
print("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*")
print("          GREENPULSE SETUP COMPLETE")
print("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*")
print()
print("Created:")
print(start_script)
print()
print("From now on, run:")
print()
print("python start_greenpulse.py")
print()
print("GreenPulse Dashboard:")
print("http://localhost:5173")
print()

subprocess.Popen([
    "notify-send",
    "GreenPulse Setup Complete",
    "Next time, run start_greenpulse.py instead of setup.py"
])

input("Press Enter to close...")
