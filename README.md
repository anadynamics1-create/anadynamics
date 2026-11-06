# ANADynamics — Company Website

Dark, copper-accented website for ANADynamics, an automation and robotics consultancy for the process and power industries.
Pure HTML5, CSS3 and vanilla JavaScript. No frameworks and no build step.

## Structure

```
anadynamics/
├── index.html                 All page content
├── css/style.css              Theme, layout, responsive rules
├── js/script.js               Menu, scroll spy, reveal, tabs, service pop-ups, form
├── assets/
│   ├── images/
│   │   ├── logo-mark.png      Emblem (transparent), used in hero
│   │   ├── logo-mark-sm.png   Small emblem, used in navigation
│   │   ├── logo-wordmark.png  "ANADYNAMICS" wordmark (transparent)
│   │   ├── logo-full.png      Emblem + wordmark, used in footer
│   │   ├── founder.jpg/.webp  Founder photo
│   │   └── og-image.jpg       Social-sharing preview (1200×630)
│   └── icons/apple-touch-icon.png
├── favicon.ico / favicon.png
├── README.md
└── .gitignore
```

## TODO before going live

| # | Item | Where in index.html |
|---|------|------|
| 1 | Confirm founder title ("Founder, ANADynamics") | `#founder`, `.role` |
| 2 | Business address / city (map optional) | Contact section, commented "Location" block |
| 3 | WhatsApp: uncomment if +91 95915 57311 is on WhatsApp | Contact section |
| 4 | Social links (LinkedIn, etc.) | Footer, "Contact" column |
| 5 | Live domain | `<link rel="canonical">`, and use absolute URLs for `og:image` |
| 6 | Area served (city/state/country) | JSON-LD `areaServed` in `<head>` |
| 7 | Case studies (only with client permission) | Commented `#work` section |
| 8 | "How we work" steps: suggested wording, edit to match your real process | `#why`, `.steps` |
| 9 | Optional: Formspree endpoint for direct form delivery | `data-endpoint` on `<form>` |

## Preview locally

Double-click `index.html`, or run:

```bash
cd anadynamics
python -m http.server 8000
# open http://localhost:8000
```

## Upload to GitHub

```bash
cd anadynamics
git init
git add .
git commit -m "ANADynamics website"
git branch -M main
git remote add origin https://github.com/<username>/anadynamics.git
git push -u origin main
```

## Deploy

- **Netlify:** drag the folder onto https://app.netlify.com/drop, or import the GitHub repo (build command empty, publish directory `/`).
- **Vercel:** New Project → import repo → Framework "Other" → Deploy.
- **GitHub Pages:** repo Settings → Pages → Deploy from branch → `main` / root.

## Custom domain

Buy a domain (e.g. anadynamics.com/.in), then in Netlify/Vercel open *Domains → Add domain* and follow the DNS records
they show (usually an A record for the root and a CNAME for `www`). HTTPS is issued automatically.
Then update the canonical and Open Graph URLs in `<head>`.

## Contact form

The form validates input in the browser. It does **not** send messages by itself: on submit it opens the visitor's
email app with the request pre-filled to anadynamics1@gmail.com.

For direct delivery:
- **Formspree:** create a form at https://formspree.io and paste the endpoint into `data-endpoint="https://formspree.io/f/xxxx"`.
  Update the `.note` text under the button.
- **Netlify Forms:** add `name="contact" data-netlify="true"` to the form plus
  `<input type="hidden" name="form-name" value="contact">`, and set `data-endpoint="/"`.
  (Netlify expects URL-encoded data; if needed change the fetch body to `new URLSearchParams(d)` with header `Content-Type: application/x-www-form-urlencoded`.)

## Updating content

| What | How |
|------|-----|
| Text | Edit `index.html` directly; each section is labelled with a comment. |
| Services | Copy an `<article class="service">`. The pop-up content is its `<template>`. Add the same name as an `<option>` in the form. |
| Industries | Edit the `.ind` blocks in `#panel-process` / `#panel-power`. |
| FAQ | Copy a `<details>` block. |
| Logo | Replace the PNGs in `assets/images/` (transparent background, same names). |
| Founder photo | Replace `founder.jpg` and `founder.webp` (portrait ~600×666 px). |
| Colours | Edit the CSS variables at the top of `style.css` (`--copper`, `--copper-l`, `--copper-d`, `--bg`). |

## Features

Responsive (mobile → desktop) · hamburger menu (Esc closes) · scroll-spy · smooth scrolling · animated gears and circuit
traces · scroll reveal · accessible tabs (arrow keys) · service pop-ups that pre-select the service in the form · FAQ accordion ·
validated contact form · reduced-motion support · SEO, Open Graph and JSON-LD metadata.
External dependency: Google Fonts (Sora, Inter, JetBrains Mono).
