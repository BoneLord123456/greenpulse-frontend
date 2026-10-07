import subprocess
import time

PROJECT = '/home/boni/Downloads/GreenPulse Project'


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
cd -- '/home/boni/Downloads/GreenPulse Project'/pollution_backend || exit 1

echo
echo "Starting ML Backend..."
echo

source .venv/bin/activate.fish

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

exec fish
""")


# GreenPlus Hero Page
open_terminal(f"""
cd -- '/home/boni/Downloads/GreenPulse Project'/GreenPlus-main || exit 1

echo
echo "Starting GreenPulse Hero Page..."
echo

npm run dev

exec fish
""")


# GreenPulse Dashboard
open_terminal(f"""
cd -- '/home/boni/Downloads/GreenPulse Project'/greenpulse || exit 1

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
