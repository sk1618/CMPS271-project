# Step 1: Navigate to your project directory

# Step 2: Create a virtual environment (if not already created)
python -m venv env
python3 -m venv env(mac)

eza aa coputer l jem3a run this before Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Step 3: Activate the virtual environment
.\env\Scripts\activate  (windows)
source env/bin/activate (mac)


# Step 4: Install all necessary packages
pip install python-multipart
pip install -r requirements.txt

# Step 6: Run the FastAPI app with auto-reloading (adjust 'main:app' to your actual file and app names)
uvicorn main:app --reload

# Step 7: Deactivate the virtual environment (when done)
deactivate
