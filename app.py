import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Prompt Satya", layout="wide", initial_sidebar_state="collapsed")

# Hide standard Streamlit header and padding
st.markdown("""
<style>
    #MainMenu, header, footer {visibility: hidden;}
    .block-container {padding: 0px !important;}
    iframe {position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none;}
</style>
""", unsafe_allow_html=True)

# 1. Fetch secret safely
api_key = st.secrets.get("GEMINI_API_KEY", "")

# 2. Read index.html safely without f-string corruption
with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# 3. Inject key cleanly before </head>
injection = f"<script>window.STREAMLIT_GEMINI_KEY = '{api_key}';</script>\n</head>"
if "</head>" in html_content:
    final_html = html_content.replace("</head>", injection, 1)
else:
    final_html = f"<script>window.STREAMLIT_GEMINI_KEY = '{api_key}';</script>" + html_content

components.html(final_html, height=900, scrolling=True)
