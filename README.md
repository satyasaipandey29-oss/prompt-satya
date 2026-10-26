# ⚡ dev-tty0 | Interactive Terminal Portfolio

> A sleek, retro CRT Unix-style web terminal and developer portfolio engineered with zero bloated frameworks—just pure vanilla web fundamentals.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge&logo=google-chrome)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Variables-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 🖥️ Overview

**dev-tty0** simulates a hardware CRT terminal interface running directly in the browser. Ditching conventional modern landing page templates, it invites visitors to navigate developer highlights, technical toolstacks, bio, and showcase projects through an interactive Bash-like command-line environment.

---

## ✨ Features

- **⚡ Zero Dependencies**: Hand-crafted with semantic HTML5, modern CSS3 variables, and native JavaScript DOM APIs.
- **⌨️ Realistic Shell Mechanics**:
  - Command history navigation using **Up / Down arrow keys**.
  - **Tab auto-completion** for available system commands.
  - Auto-scrolling and persistent input focus on terminal window clicks.
- **🎨 Dynamic CRT Theming**: Instant runtime theme switching via custom CSS variables (`neon`, `matrix`, `amber`, `dracula`).
- **📱 Mobile Optimized**: Includes a contextual quick-action command bar for touch screens without sacrificing the raw terminal feel.
- **👾 Hidden Easter Eggs**: Built-in interactive secrets (digital matrix rain, special developer quotes, and sudo security alerts).

---

## 🛠️ Built-in Commands

| Command | Description |
| :--- | :--- |
| `help` | Outputs the complete index of available CLI instructions |
| `whoami` | Displays developer bio, philosophy, and professional background |
| `skills` | Renders categorized skill stacks with ASCII progress meters |
| `projects` | Details featured development projects and repository links |
| `theme <name>` | Swaps aesthetic themes (`neon`, `matrix`, `amber`, `dracula`) |
| `clear` / `cls` | Clears stdout buffer history from screen |
| `echo <text>` | Prints supplied arguments back to the screen |
| `contact` | Lists direct email, socials, and contact endpoints |
| `sudo <action>` | Simulates system-level permission rejection alert |
| `matrix` | Toggles the digital falling-code canvas visualizer |

---

## 🚀 Quick Start & Local Setup

Clone the repository and launch it directly in your browser:

```bash
# 1. Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git

# 2. Change directory
cd <REPO_NAME>

# 3. Open index.html in your browser
# On macOS:
open index.html

# On Linux:
xdg-open index.html

# On Windows:
start index.html
```

Or serve it with a lightweight dev server:
```bash
npx serve .
# or
python3 -m http.server 8000
```

---

## 🌐 Deployment to GitHub Pages

1. Push your code to the `main` branch of your GitHub repository.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment > Branch**, select `main` and set folder to `/(root)`.
4. Click **Save**. Your site will be live at `https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
