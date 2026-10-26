import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Prompt Satya", layout="wide", initial_sidebar_state="collapsed")

st.markdown("""
<style>
    #MainMenu, header, footer {visibility: hidden;}
    .block-container {padding: 0px !important;}
    iframe {position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none;}
</style>
""", unsafe_allow_html=True)

# 1. Fetch secret key safely
api_key = st.secrets.get("GEMINI_API_KEY", "")

# 2. Read all files directly from the repository
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

# 3. Inject CSS, Key, and JS directly into the document
injection = f"""
<style>
{css}
</style>
<script>
window.STREAMLIT_GEMINI_KEY = '{api_key}';
</script>
</head>
"""

# Replace the head tag with inline styles & config
if "</head>" in html:
    html = html.replace("</head>", injection, 1)
else:
    html = injection + html

# Inject the full script before the closing body tag
if "</body>" in html:
    html = html.replace("</body>", f"<script>\n{js}\n</script>\n</body>", 1)
else:
    html = html + f"<script>\n{js}\n</script>"

components.html(html, height=900, scrolling=True)
