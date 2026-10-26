// ============================================================
//  CYBERPUNK TERMINAL — script.js
//  Self-contained command engine. Zero dependencies.
// ============================================================

'use strict';

// ── AI Configuration ─────────────────────────────────────────
// ⚠️  REPLACE "YOUR_API_KEY" below with your actual Gemini API
//     key from https://aistudio.google.com/app/apikey
//     Never commit a real key to a public repository.
// ─────────────────────────────────────────────────────────────
const GEMINI_API_KEY = 'YOUR_API_KEY';
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/* ── Uptime clock ─────────────────────────────────────────── */
const BOOT_TIME = Date.now();
function uptime() {
  const s = Math.floor((Date.now() - BOOT_TIME) / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

/* ── DOM refs ─────────────────────────────────────────────── */
const output     = document.getElementById('output');
const cmdInput   = document.getElementById('cmd-input');
const uptimeEl   = document.getElementById('uptime-val');
const themeRoot  = document.documentElement;

/* ── State ────────────────────────────────────────────────── */
let history    = [];
let historyIdx = -1;
let currentTheme = 'neon';
let matrixActive = false;
let matrixAnim   = null;

/* ── Uptime ticker ────────────────────────────────────────── */
setInterval(() => { if (uptimeEl) uptimeEl.textContent = uptime(); }, 1000);

/* ─────────────────────────────────────────────────────────── */
/*  COMMAND DEFINITIONS                                        */
/* ─────────────────────────────────────────────────────────── */

const COMMANDS = {

  /* ── help ─────────────────────────────────────────────── */
  help() {
    return html(`
<div class="section-header">▸ AVAILABLE COMMANDS</div>
<table class="cmd-table">
  <tr><td class="cmd-name">help</td>
      <td class="cmd-desc">Show this help screen</td></tr>
  <tr><td class="cmd-name">whoami</td>
      <td class="cmd-desc">Developer bio, background &amp; philosophy</td></tr>
  <tr><td class="cmd-name">skills</td>
      <td class="cmd-desc">Categorised tech skills with progress bars</td></tr>
  <tr><td class="cmd-name">projects</td>
      <td class="cmd-desc">Showcase projects with tech stacks &amp; links</td></tr>
  <tr><td class="cmd-name">contact</td>
      <td class="cmd-desc">Social links, GitHub &amp; email</td></tr>
  <tr><td class="cmd-name">theme &lt;name&gt;</td>
      <td class="cmd-desc">Switch colour theme — neon | matrix | amber | dracula</td></tr>
  <tr><td class="cmd-name">echo &lt;text&gt;</td>
      <td class="cmd-desc">Print back any text to the terminal</td></tr>
  <tr><td class="cmd-name">clear / cls</td>
      <td class="cmd-desc">Wipe the terminal screen</td></tr>
  <tr><td class="cmd-name">sudo &lt;cmd&gt;</td>
      <td class="cmd-desc">Try your luck with superuser powers</td></tr>
  <tr><td class="cmd-name">matrix</td>
      <td class="cmd-desc">Activate the digital rain overlay 🌧</td></tr>
  <tr><td class="cmd-name">quote</td>
      <td class="cmd-desc">Print an iconic hacker / dev quote</td></tr>
  <tr><td class="cmd-name">date</td>
      <td class="cmd-desc">Current date &amp; time</td></tr>
  <tr><td class="cmd-name">uptime</td>
      <td class="cmd-desc">Session uptime</td></tr>
  <tr><td class="cmd-name">banner</td>
      <td class="cmd-desc">Redisplay the welcome ASCII banner</td></tr>
  <tr><td class="cmd-name ai-cmd">ask / chat &lt;q&gt;</td>
      <td class="cmd-desc"><span class="ai-badge">AI</span> Send a question to the Gemini AI core</td></tr>
</table>
<div class="hl-muted" style="margin-top:8px;font-size:0.85em;">
  ↑ / ↓ arrow keys — navigate history &nbsp;|&nbsp;
  Tab — autocomplete &nbsp;|&nbsp;
  Ctrl+L — clear screen
</div>
`);
  },

  /* ── whoami ───────────────────────────────────────────── */
  whoami() {
    return html(`
<div class="section-header">▸ IDENTITY MODULE</div>
<pre class="hl-accent">
  ██████╗ ███████╗██╗   ██╗
  ██╔══██╗██╔════╝██║   ██║
  ██║  ██║█████╗  ██║   ██║
  ██║  ██║██╔══╝  ╚██╗ ██╔╝
  ██████╔╝███████╗ ╚████╔╝ 
  ╚═════╝ ╚══════╝  ╚═══╝  
</pre>
<div style="margin:8px 0 4px">
  <span class="hl-accent bold">Name</span>
  <span class="hl-muted"> ............... </span>
  <span class="hl-accent2">Dev // Builder // Hacker</span>
</div>
<div style="margin:4px 0">
  <span class="hl-accent bold">Location</span>
  <span class="hl-muted"> ............. </span>
  <span>Earth, Third Rock from the ☀</span>
</div>
<div style="margin:4px 0">
  <span class="hl-accent bold">Status</span>
  <span class="hl-muted"> ............... </span>
  <span class="hl-warn">⚡ Always building something</span>
</div>

<div class="section-header" style="margin-top:14px">▸ BACKGROUND</div>
<p style="color:var(--text-muted);max-width:600px;line-height:1.7">
  Full-stack engineer obsessed with elegant systems, clean abstractions,
  and user experiences that feel like magic. I fell in love with code when
  I realised it's the closest thing to a superpower a human can have.
  I live at the intersection of low-level performance and high-level UX.
</p>

<div class="section-header" style="margin-top:14px">▸ PHILOSOPHY</div>
<blockquote style="border-left:3px solid var(--accent);padding-left:12px;margin:6px 0;color:var(--text-muted);font-style:italic;">
  "Code is poetry written for two audiences: machines that must execute it,
   and humans who must maintain it. Respect both."
</blockquote>
<div style="margin-top:8px;color:var(--text-muted);font-size:0.88em">
  &gt; Open-source advocate &nbsp;|&nbsp; Type-safety zealot &nbsp;|&nbsp;
  Performance nerd &nbsp;|&nbsp; Terminal enjoyer
</div>
`);
  },

  /* ── skills ───────────────────────────────────────────── */
  skills() {
    const categories = [
      {
        title: 'Languages',
        items: [
          ['TypeScript',  95],
          ['Python',      90],
          ['Rust',        72],
          ['Go',          68],
          ['C / C++',     60],
          ['SQL',         85],
        ],
      },
      {
        title: 'Frontend',
        items: [
          ['React / Next.js', 92],
          ['Svelte / SvelteKit', 80],
          ['CSS / Tailwind', 90],
          ['WebGL / Three.js', 65],
        ],
      },
      {
        title: 'Backend & Infra',
        items: [
          ['Node.js / Bun',   88],
          ['FastAPI / Django', 82],
          ['Docker / K8s',    78],
          ['PostgreSQL',      85],
          ['Redis',           75],
          ['Linux / Bash',    88],
        ],
      },
      {
        title: 'Tools & Practices',
        items: [
          ['Git / GitHub',   95],
          ['CI/CD Pipelines', 82],
          ['TDD / BDD',      78],
          ['System Design',  80],
        ],
      },
    ];

    let out = `<div class="section-header">▸ SKILL MATRIX</div>`;
    for (const cat of categories) {
      out += `<div class="section-header" style="font-size:0.82em;border:none;margin-top:12px;">${cat.title}</div>`;
      for (const [name, pct] of cat.items) {
        out += `
<div class="skill-row">
  <span class="skill-name">${name}</span>
  <div class="skill-bar-track">
    <div class="skill-bar-fill" style="width:${pct}%"></div>
  </div>
  <span class="skill-pct">${pct}%</span>
</div>`;
      }
    }
    return html(out);
  },

  /* ── projects ─────────────────────────────────────────── */
  projects() {
    const projects = [
      {
        title:  '⚡ NeuralDash',
        desc:   'Real-time analytics dashboard with ML anomaly detection, handling 1M+ events/sec via WebSockets.',
        stack:  'TypeScript · React · Rust · Kafka · ClickHouse',
        link:   'https://github.com/example/neuraldash',
        label:  'github.com/example/neuraldash',
      },
      {
        title:  '🦀 OxideCMS',
        desc:   'Blazing-fast headless CMS built in Rust with a WASM-powered plugin system and sub-millisecond query times.',
        stack:  'Rust · WASM · SQLite · Axum',
        link:   'https://github.com/example/oxidecms',
        label:  'github.com/example/oxidecms',
      },
      {
        title:  '🤖 AutoAgent',
        desc:   'Multi-agent orchestration framework for autonomous code review, refactoring suggestions, and CI gating.',
        stack:  'Python · LangGraph · FastAPI · Docker',
        link:   'https://github.com/example/autoagent',
        label:  'github.com/example/autoagent',
      },
      {
        title:  '🌐 Lattice',
        desc:   'Distributed key-value store implementing a custom RAFT variant — built as a deep-dive into distributed systems.',
        stack:  'Go · gRPC · Protobuf · LevelDB',
        link:   'https://github.com/example/lattice',
        label:  'github.com/example/lattice',
      },
      {
        title:  '🎨 PixelForge',
        desc:   'Browser-based pixel-art editor with collaborative editing powered by CRDTs and WebRTC.',
        stack:  'SvelteKit · WebRTC · Canvas API · Supabase',
        link:   'https://github.com/example/pixelforge',
        label:  'github.com/example/pixelforge',
      },
    ];

    let out = `<div class="section-header">▸ PROJECT SHOWCASE</div>`;
    for (const p of projects) {
      out += `
<div class="project-card">
  <div class="proj-title">${p.title}</div>
  <div class="proj-desc">${p.desc}</div>
  <div class="proj-stack">⚙ ${p.stack}</div>
  <div class="proj-link">🔗 <a href="${p.link}" target="_blank" rel="noopener">${p.label}</a></div>
</div>`;
    }
    out += `<div class="hl-muted" style="font-size:0.83em;margin-top:8px">
  Type <span class="hl-accent">projects --open &lt;n&gt;</span> to open a project link (coming soon).
</div>`;
    return html(out);
  },

  /* ── contact ──────────────────────────────────────────── */
  contact() {
    const links = [
      { label: 'GitHub',   icon: '🐙', value: 'github.com/example',      href: 'https://github.com' },
      { label: 'Twitter',  icon: '🐦', value: '@example_dev',              href: 'https://twitter.com' },
      { label: 'LinkedIn', icon: '💼', value: 'linkedin.com/in/example',   href: 'https://linkedin.com' },
      { label: 'Email',    icon: '📬', value: 'hello@example.dev',         href: 'mailto:hello@example.dev' },
      { label: 'Blog',     icon: '📝', value: 'example.dev/blog',          href: 'https://example.dev' },
    ];

    let out = `<div class="section-header">▸ CONTACT VECTORS</div>`;
    for (const l of links) {
      out += `
<div class="contact-line">
  <span>${l.icon}</span>
  <span class="contact-label">${l.label}</span>
  <span class="contact-value"><a href="${l.href}" target="_blank" rel="noopener">${l.value}</a></span>
</div>`;
    }
    out += `
<div style="margin-top:12px;color:var(--text-muted);font-size:0.85em;border-top:1px solid var(--text-dim);padding-top:8px;">
  Response time: usually &lt; 24h &nbsp;|&nbsp;
  PGP key available on request &nbsp;|&nbsp;
  Open to remote opportunities 🌍
</div>`;
    return html(out);
  },

  /* ── theme ────────────────────────────────────────────── */
  theme(args) {
    const valid = ['neon', 'matrix', 'amber', 'dracula'];
    const name  = args[0]?.toLowerCase();
    if (!name || !valid.includes(name)) {
      const badges = valid.map(t =>
        `<span class="theme-badge${t === currentTheme ? ' active' : ''}"
               onclick="document.getElementById('cmd-input').value='theme ${t}';
                        document.getElementById('cmd-input').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))"
        >${t}</span>`
      ).join('');
      return html(`
<div class="section-header">▸ THEME ENGINE</div>
<div class="hl-muted">Usage: <span class="hl-accent">theme &lt;name&gt;</span></div>
<div style="margin-top:8px">Available themes: ${badges}</div>
<div class="hl-muted" style="margin-top:6px;font-size:0.85em">Current: <span class="hl-accent">${currentTheme}</span></div>
`);
    }
    currentTheme = name;
    themeRoot.setAttribute('data-theme', name);
    // Update active badges if visible
    document.querySelectorAll('.theme-badge').forEach(b => {
      b.classList.toggle('active', b.textContent === name);
    });
    return html(`
<div class="section-header">▸ THEME SWITCHED</div>
<span class="hl-muted">Active theme: </span>
<span class="hl-accent">${name}</span>
<span class="hl-muted"> — enjoy the new palette ✨</span>
`);
  },

  /* ── echo ─────────────────────────────────────────────── */
  echo(args) {
    if (!args.length) return text('Usage: echo <text>');
    return text(args.join(' '));
  },

  /* ── clear / cls ──────────────────────────────────────── */
  clear() {
    output.innerHTML = '';
    return null; // no output block added
  },
  cls() { return COMMANDS.clear(); },

  /* ── sudo ─────────────────────────────────────────────── */
  sudo(args) {
    const jokes = [
      '🚫 Permission denied: Incident will be reported to Santa Claus.',
      '🚔 sudo: Thought Police notified. Sit tight.',
      '⛔ root is reserved for fictional characters. Are you fictional? Didn\'t think so.',
      '☠ sudo: Initiating dramatic self-destruct in 3… 2… 1… (just kidding)',
      '🔐 sudo: Your hacker license expired in 1999. Please renew.',
      '🎩 Nice try! sudo has been removed and replaced with asking nicely.',
      '🦆 sudo: The rubber duck gods have been displeased. Try prayer instead.',
    ];
    return html(`<span class="hl-error">${jokes[Math.floor(Math.random() * jokes.length)]}</span>`);
  },

  /* ── matrix ───────────────────────────────────────────── */
  matrix() {
    startMatrix();
    return html(`<span class="hl-accent">Initiating MATRIX protocol...</span>
<span class="hl-muted"> Click anywhere or press </span>
<span class="hl-accent">ESC</span>
<span class="hl-muted"> to exit the simulation.</span>`);
  },

  /* ── quote ────────────────────────────────────────────── */
  quote() {
    const quotes = [
      ['It\'s not a bug — it\'s an undocumented feature.',                    'Ancient Dev Proverb'],
      ['Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', 'Martin Fowler'],
      ['First, solve the problem. Then, write the code.',                     'John Johnson'],
      ['Code never lies; comments sometimes do.',                             'Ron Jeffries'],
      ['The best code is no code at all.',                                    'Jeff Atwood'],
      ['Talk is cheap. Show me the code.',                                    'Linus Torvalds'],
      ['Programs must be written for people to read, and only incidentally for machines to execute.', 'Harold Abelson'],
      ['Software is like entropy: It is difficult to grasp, weighs nothing, and obeys the Second Law of Thermodynamics; i.e., it always increases.', 'Norman Augustine'],
      ['If debugging is the process of removing software bugs, then programming must be the process of putting them in.', 'Edsger Dijkstra'],
      ['In theory, there is no difference between theory and practice. But in practice, there is.', 'Jan L.A. van de Snepscheut'],
      ['Premature optimization is the root of all evil.',                     'Donald Knuth'],
      ['The most dangerous phrase in the language is: We\'ve always done it this way.', 'Grace Hopper'],
    ];
    const [q, author] = quotes[Math.floor(Math.random() * quotes.length)];
    return html(`
<div style="border-left:3px solid var(--accent);padding-left:14px;margin:4px 0;">
  <div class="hl-accent2" style="font-style:italic;">"${q}"</div>
  <div class="hl-muted" style="margin-top:4px;font-size:0.85em;">— ${author}</div>
</div>
<div class="hl-muted" style="font-size:0.82em;margin-top:6px">Type <span class="hl-accent">quote</span> again for another one.</div>
`);
  },

  /* ── date ─────────────────────────────────────────────── */
  date() {
    const now  = new Date();
    const iso  = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const local = now.toLocaleString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    return html(`
<div><span class="hl-muted">UTC:   </span><span class="hl-accent">${iso}</span></div>
<div><span class="hl-muted">Local: </span><span class="hl-accent2">${local}</span></div>
`);
  },

  /* ── uptime ───────────────────────────────────────────── */
  uptime() {
    return html(`
<span class="hl-muted">Session uptime: </span>
<span class="hl-accent">${uptime()}</span>
`);
  },

  /* ── banner ───────────────────────────────────────────── */
  banner() {
    output.innerHTML = '';
    printBanner();
    return null;
  },

  /* ── Easter eggs ──────────────────────────────────────── */
  hack() {
    return html(`
<span class="hl-error">INTRUSION DETECTED</span>
<span class="hl-muted"> — just kidding. There's nothing to hack here.</span>
<br><span class="hl-muted">But nice try, </span><span class="hl-accent">neo</span><span class="hl-muted">.</span>
`);
  },

  coffee() {
    return html(`
<pre class="hl-accent">
      ( (
       ) )
    .______.
    |      |]
    \\      /
     \`----\`
</pre>
<span class="hl-muted">&#9749; Here's your virtual coffee. Compile and debug responsibly.</span>
`);
  },

  exit() {
    return html(`<span class="hl-muted">There is no escape. The terminal is forever. 🖥</span>`);
  },

  ls() {
    return html(`
<span class="hl-accent">./</span>  <span class="hl-accent">../</span>  <span class="hl-accent2">dreams/</span>  <span class="hl-accent2">unfinished_projects/</span>  <span class="hl-accent2">bugs/</span>  <span class="hl-muted">README.md</span>  <span class="hl-muted">.secrets</span>
<div class="hl-muted" style="font-size:0.85em;margin-top:4px">Hint: the interesting stuff is always in <span class="hl-accent">hidden directories</span>.</div>
`);
  },

  pwd() {
    return text('/home/you/the-matrix/reality');
  },

  vi()  { return html(`<span class="hl-error">:q!</span><span class="hl-muted"> — Don't worry, I've already exited vi for you.</span>`); },
  vim() { return COMMANDS.vi(); },
  nano(){ return html(`<span class="hl-muted">Opening nano... ^X to quit (you're welcome).</span>`); },

  ping(args) {
    const host = args[0] || 'localhost';
    return html(`
<div>PING <span class="hl-accent">${host}</span></div>
<div class="hl-muted">64 bytes from ${host}: icmp_seq=1 ttl=64 time=<span class="hl-accent">0.42 ms</span></div>
<div class="hl-muted">64 bytes from ${host}: icmp_seq=2 ttl=64 time=<span class="hl-accent">0.38 ms</span></div>
<div class="hl-muted">64 bytes from ${host}: icmp_seq=3 ttl=64 time=<span class="hl-accent">0.41 ms</span></div>
<div class="hl-muted">--- ${host} ping statistics ---</div>
<div class="hl-accent">3 packets transmitted, 3 received, 0% packet loss</div>
`);
  },

  /* ── ask / chat — Gemini AI core ─────────────────────── */
  ask(args) {
    return runAIQuery(args);
  },
  chat(args) {
    return runAIQuery(args);
  },
};

/* ─────────────────────────────────────────────────────────── */
/*  GEMINI AI CORE                                             */
/* ─────────────────────────────────────────────────────────── */

/**
 * runAIQuery — validates the prompt, shows a loading node, fires
 * the Gemini API fetch asynchronously, then replaces / appends
 * the response into the terminal without blocking the UI.
 *
 * Returns a loading DOM node immediately (synchronous); the async
 * response is injected later and the terminal is scrolled again.
 */
function runAIQuery(args) {
  // Edge-case: no prompt provided
  if (!args.length || !args.join(' ').trim()) {
    return html(`
<div class="hl-warn">Usage: <span class="hl-accent">ask &lt;your question or prompt&gt;</span></div>
<div class="hl-muted" style="font-size:0.85em;margin-top:3px">
  Example: <span class="hl-accent">ask What is a Merkle tree?</span>
</div>`);
  }

  // Guard: key not configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
    return html(`
<div class="hl-error">[AI CORE ERROR]: No API key configured.</div>
<div class="hl-muted" style="font-size:0.85em;margin-top:4px">
  Open <span class="hl-accent">script.js</span> and replace
  <span class="hl-accent">YOUR_API_KEY</span> with your Gemini key from
  <a href="https://aistudio.google.com/app/apikey" target="_blank"
     rel="noopener" style="color:var(--accent2)">aistudio.google.com</a>.
</div>`);
  }

  const userPrompt = args.join(' ').trim();

  // ── Loading node (injected immediately) ───────────────────
  const loader = document.createElement('div');
  loader.className = 'output-block ai-loader';
  loader.innerHTML = `
<div class="ai-prefix">[AI CORE]</div>
<div class="ai-loading">
  <span class="ai-spinner">◐</span>
  <span class="ai-loading-text">Processing query</span>
  <span class="ai-dots"></span>
</div>`;
  output.appendChild(loader);
  scrollBottom();

  // Disable input while waiting
  cmdInput.disabled = true;

  // ── Async Gemini fetch ────────────────────────────────────
  (async () => {
    try {
      const res = await fetch(GEMINI_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody}`);
      }

      const data = await res.json();

      // Safe extraction — walk the response tree defensively
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?? '[AI CORE]: Empty response received.';

      // Replace loader with the formatted response
      loader.outerHTML = buildAIResponseHTML(userPrompt, reply);

    } catch (err) {
      console.error('[AI CORE]', err);
      loader.outerHTML = `
<div class="output-block ai-response error">
  <div class="ai-prefix error">[AI CORE ERROR]</div>
  <div class="ai-body hl-error">
    Failed to fetch response. Verify your API configuration.
  </div>
  <div class="ai-meta hl-muted" style="font-size:0.78em;margin-top:4px">
    ${escapeHtml(String(err.message).slice(0, 200))}
  </div>
</div>`;
    } finally {
      cmdInput.disabled = false;
      cmdInput.focus();
      scrollBottom();
    }
  })();

  // Return null — the loader was appended directly above
  return null;
}

/** Build the styled HTML block for a successful AI reply. */
function buildAIResponseHTML(prompt, reply) {
  // Convert newlines to <br> and escape HTML in the reply body
  const safeReply = escapeHtml(reply)
    .replace(/\n{2,}/g, '</p><p class="ai-para">')  // double-newline → paragraph
    .replace(/\n/g, '<br>');                          // single newline → line break

  // Light markdown-ish highlighting: **bold** and `code`
  const formatted = safeReply
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>');

  return `
<div class="output-block ai-response">
  <div class="ai-header">
    <span class="ai-prefix">[SATYA-AI]</span>
    <span class="ai-query-label hl-muted"> ↳ ${escapeHtml(prompt.slice(0, 80))}${prompt.length > 80 ? '…' : ''}</span>
  </div>
  <div class="ai-body">
    <p class="ai-para">${formatted}</p>
  </div>
  <div class="ai-footer hl-muted">
    ─── powered by Gemini 1.5 Flash ───
  </div>
</div>`;
}

/** Minimal HTML entity escaper to prevent XSS from API responses. */
function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/* ── Helper: create html output node ────────────────────── */
function html(innerHtml) {
  const div = document.createElement('div');
  div.className = 'output-block';
  div.innerHTML = innerHtml;
  return div;
}

function text(str) {
  const div = document.createElement('div');
  div.className = 'output-block';
  div.textContent = str;
  return div;
}

function errorBlock(str) {
  const div = document.createElement('div');
  div.className = 'output-block error';
  div.textContent = str;
  return div;
}

/* ── Append to output ────────────────────────────────────── */
function appendOutput(node) {
  if (!node) return;
  output.appendChild(node);
  scrollBottom();
}

function scrollBottom() {
  output.scrollTop = output.scrollHeight;
}

/* ── Command parser ──────────────────────────────────────── */
function parseAndRun(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  // Echo the command line
  const echoDiv = document.createElement('div');
  echoDiv.className = 'output-block command-echo';
  echoDiv.textContent = `user@system:~$ ${trimmed}`;
  output.appendChild(echoDiv);

  // Parse: split but respect quoted strings
  const tokens = tokenise(trimmed);
  const cmd     = tokens[0].toLowerCase();
  const args    = tokens.slice(1);

  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd](args);
    appendOutput(result);
  } else {
    appendOutput(errorBlock(
      `command not found: ${cmd}  (type 'help' for available commands)`
    ));
  }

  scrollBottom();
}

function tokenise(str) {
  const out = [];
  let cur = '';
  let inQuote = false;
  let quoteChar = '';
  for (const ch of str) {
    if (inQuote) {
      if (ch === quoteChar) { inQuote = false; }
      else { cur += ch; }
    } else if (ch === '"' || ch === "'") {
      inQuote = true; quoteChar = ch;
    } else if (ch === ' ') {
      if (cur) { out.push(cur); cur = ''; }
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [''];
}

/* ── Tab completion ──────────────────────────────────────── */
const KNOWN_COMMANDS = Object.keys(COMMANDS).sort();

function tabComplete(value) {
  const parts = value.split(' ');
  if (parts.length === 1) {
    const prefix  = parts[0].toLowerCase();
    const matches = KNOWN_COMMANDS.filter(c => c.startsWith(prefix));
    if (matches.length === 1) {
      return matches[0] + ' ';
    } else if (matches.length > 1) {
      // Print matches as hint
      const hint = document.createElement('div');
      hint.className = 'output-block';
      hint.innerHTML = matches.map(m =>
        `<span class="hl-accent">${m}</span>`
      ).join('  ');
      output.appendChild(hint);
      scrollBottom();
      // Return longest common prefix
      return longestCommonPrefix(matches);
    }
  } else if (parts[0].toLowerCase() === 'theme' && parts.length === 2) {
    const themes  = ['neon', 'matrix', 'amber', 'dracula'];
    const prefix  = parts[1].toLowerCase();
    const matches = themes.filter(t => t.startsWith(prefix));
    if (matches.length === 1) return `theme ${matches[0]} `;
  }
  return value;
}

function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (const s of strs.slice(1)) {
    while (!s.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}

/* ── Keyboard handler ────────────────────────────────────── */
cmdInput.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Enter': {
      e.preventDefault();
      const val = cmdInput.value;
      if (val.trim()) {
        history.unshift(val);
        if (history.length > 200) history.pop();
        historyIdx = -1;
      }
      cmdInput.value = '';
      parseAndRun(val);
      break;
    }
    case 'ArrowUp': {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        cmdInput.value = history[historyIdx];
        // Move cursor to end
        requestAnimationFrame(() => {
          cmdInput.selectionStart = cmdInput.selectionEnd = cmdInput.value.length;
        });
      }
      break;
    }
    case 'ArrowDown': {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        cmdInput.value = history[historyIdx];
      } else {
        historyIdx = -1;
        cmdInput.value = '';
      }
      break;
    }
    case 'Tab': {
      e.preventDefault();
      cmdInput.value = tabComplete(cmdInput.value);
      break;
    }
    case 'l': {
      if (e.ctrlKey) {
        e.preventDefault();
        COMMANDS.clear();
      }
      break;
    }
    case 'c': {
      if (e.ctrlKey) {
        e.preventDefault();
        const echoDiv = document.createElement('div');
        echoDiv.className = 'output-block command-echo';
        echoDiv.textContent = `user@system:~$ ${cmdInput.value}^C`;
        output.appendChild(echoDiv);
        cmdInput.value = '';
        historyIdx = -1;
        scrollBottom();
      }
      break;
    }
    case 'Escape': {
      if (matrixActive) stopMatrix();
      break;
    }
  }
});

/* ── Auto-focus on terminal click ────────────────────────── */
document.getElementById('terminal-window').addEventListener('click', () => {
  cmdInput.focus();
});

/* ── Mobile quick commands ───────────────────────────────── */
document.querySelectorAll('.qcmd').forEach(btn => {
  btn.addEventListener('click', () => {
    const cmd = btn.dataset.cmd;

    // For the AI chip: pre-fill input and focus so user can type their question
    if (cmd === 'ask ') {
      cmdInput.value = 'ask ';
      cmdInput.focus();
      return;
    }

    cmdInput.value = cmd;
    parseAndRun(cmd);
    cmdInput.value = '';
    cmdInput.focus();
  });
});

/* ── Welcome Banner ──────────────────────────────────────── */
function printBanner() {
  const banner = document.createElement('div');
  banner.className = 'output-block';
  banner.innerHTML = `
<pre class="banner-line" style="font-size:0.9em;">
 ███████╗ █████╗ ████████╗██╗   ██╗ █████╗
 ██╔════╝██╔══██╗╚══██╔══╝╚██╗ ██╔╝██╔══██╗
 ███████╗███████║   ██║    ╚████╔╝ ███████║
 ╚════██║██╔══██║   ██║     ╚██╔╝  ██╔══██║
 ███████║██║  ██║   ██║      ██║   ██║  ██║
 ╚══════╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝
</pre>
<div style="color:var(--accent2);font-size:0.88em;letter-spacing:0.18em;margin:-4px 0 10px;text-shadow:0 0 10px var(--accent2-glow);">
  ── TTY0 &nbsp;·&nbsp; INTERACTIVE PORTFOLIO TERMINAL ──
</div>

<div class="boot-log" style="color:var(--text-muted);font-size:0.82em;line-height:1.9;">
  <div><span style="color:var(--accent)">[ &nbsp;OK &nbsp;]</span> &nbsp;Loaded kernel modules &nbsp;<span style="color:var(--text-dim)">6.7.0-cyber-amd64</span></div>
  <div><span style="color:var(--accent)">[ &nbsp;OK &nbsp;]</span> &nbsp;Started CRT display driver &nbsp;<span style="color:var(--text-dim)">scanline@vga.service</span></div>
  <div><span style="color:var(--accent)">[ &nbsp;OK &nbsp;]</span> &nbsp;Mounted filesystem &nbsp;<span style="color:var(--text-dim)">/home/satya</span></div>
  <div><span style="color:var(--accent)">[ &nbsp;OK &nbsp;]</span> &nbsp;Reached target &nbsp;<span style="color:var(--text-dim)">Multi-User System</span></div>
  <div><span style="color:var(--warn)">[WARN ]</span> &nbsp;coffee.service: caffeination level low — please refill</div>
  <div><span style="color:var(--accent)">[ &nbsp;OK &nbsp;]</span> &nbsp;Portfolio shell ready &nbsp;<span style="color:var(--text-dim)">cysh 3.1.4 (interactive)</span></div>
</div>

<div style="margin-top:12px;border:1px solid var(--text-dim);border-left:3px solid var(--accent);
            padding:8px 14px;border-radius:0 4px 4px 0;background:rgba(0,255,65,0.03);">
  <span style="color:var(--accent);font-weight:bold;">
    Type <span style="text-shadow:0 0 8px var(--accent-glow);">'help'</span>
    to see available commands or click a chip below.
  </span>
</div>`;
  output.appendChild(banner);
}

/* ── Matrix Rain ─────────────────────────────────────────── */
const canvas      = document.getElementById('matrix-canvas');
const matrixClose = document.getElementById('matrix-close');
const ctx         = canvas.getContext('2d');

function startMatrix() {
  if (matrixActive) return;
  matrixActive = true;
  canvas.style.display = 'block';
  matrixClose.style.display = 'block';

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const fontSize = 14;
  const cols     = Math.floor(canvas.width / fontSize);
  const drops    = Array(cols).fill(1);
  const chars    = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/\\|{};';

  function drawRain() {
    if (!matrixActive) return;
    ctx.fillStyle = 'rgba(0, 5, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Use accent colour from CSS var
    const accentVar = getComputedStyle(themeRoot).getPropertyValue('--accent').trim() || '#00ff41';
    ctx.fillStyle = accentVar;
    ctx.font      = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(drawRain);
  }
  drawRain();

  // Click-to-close
  canvas.addEventListener('click', stopMatrix, { once: true });
}

function stopMatrix() {
  matrixActive = false;
  if (matrixAnim) { cancelAnimationFrame(matrixAnim); matrixAnim = null; }
  canvas.style.display    = 'none';
  matrixClose.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

matrixClose.addEventListener('click', stopMatrix);

window.addEventListener('resize', () => {
  if (matrixActive) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

/* ── ESC global ──────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && matrixActive) stopMatrix();
});

/* ── Init ────────────────────────────────────────────────── */
(function init() {
  printBanner();
  // Input row appears immediately after banner — focus it
  requestAnimationFrame(() => {
    cmdInput.focus();
  });
  // Kick uptime display
  if (uptimeEl) uptimeEl.textContent = uptime();
})();
