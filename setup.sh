
#!/bin/bash

# Quick setup for SHAURYABA05/Suspicious-Human-Activity-Detection

echo "Creating virtual environment..."
python3 -m venv venv

echo "Activating venv..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Setup complete!"
echo "Update src/config.py with your own DB/email/SMS credentials."
echo "Run with: streamlit run src/app.py"

