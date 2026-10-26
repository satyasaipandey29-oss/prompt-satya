import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Prompt Satya", layout="wide", initial_sidebar_state="collapsed")

# Read all 3 files
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

# Inject CSS and JS directly into the HTML string
full_html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        {css}
    </style>
</head>
<body style="margin: 0; padding: 0; background: #0d1117;">
    {html.split('<body>')[1].split('</body>')[0] if '<body>' in html else html}
    <script>
        {js}
    </script>
</body>
</html>
"""

components.html(full_html, height=850, scrolling=True)
