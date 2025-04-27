import requests
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import re
import io
import zipfile
import os

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"  # Ensure OLLAMA is running

def convert_sybase_to_oracle(sybase_code):
    prompt = f"""
    Convert the following Sybase SQL code into optimized Oracle SQL:
    {sybase_code}

    Ensure:
    - Convert identity column syntax IDENTITY(1,1) to Oracle's equivalent
    - Use Oracle syntax for auto-increment columns
    - Convert SELECT TOP 1 to Oracle ROWNUM syntax
    - Use VARCHAR2 instead of VARCHAR
    - Modern Oracle best practices
    - No extra explanation, just code inside triple backticks: sql
    """

    response = requests.post(OLLAMA_URL, json={
        "model": "codellama",
        "prompt": prompt,
        "stream": False
    })

    response_data = response.json()
    response_text = response_data.get("response", "Error: No response from Ollama")

    match = re.search(r"```sql\s+(.*?)```", response_text, re.DOTALL)

    if match:
        oracle_sql = match.group(1).strip()
    else:
        oracle_sql = response_text.strip()

    return oracle_sql

@app.route("/convert-multiple", methods=["POST"])
def convert_multiple():
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400

    files = request.files.getlist('files')

    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    converted_files = []

    for file in files:
        filename = file.filename
        if filename.endswith(('.sql', '.txt')):  # Accept .sql and .txt
            sybase_code = file.read().decode('utf-8', errors='ignore')
            oracle_code = convert_sybase_to_oracle(sybase_code)

            converted_files.append({
                "name": os.path.splitext(filename)[0] + "_oracle.sql",
                "content": oracle_code
            })

    return jsonify({"files": converted_files})

if __name__ == "__main__":
    app.run(debug=True)
