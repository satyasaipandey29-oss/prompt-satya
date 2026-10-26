import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Prompt Satya", layout="wide", initial_sidebar_state="collapsed")

# Read the secret securely from Streamlit
api_key = st.secrets.get("GEMINI_API_KEY", "")

with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Pass the secret key safely into the HTML/JS runtime
injected_html = f"""
<script>
    window.STREAMLIT_GEMINI_KEY = "{api_key}";
</script>
{html_content}
"""

components.html(injected_html, height=850, scrolling=True)
