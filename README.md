# Subhaan Shaikh — Portfolio

Personal portfolio site for **Subhaan Shaikh**, Backend & Systems Engineer.

**Live:** [https://subhaan0804.github.io/](https://subhaan0804.github.io/)

## Stack

Vanilla HTML, CSS, and JavaScript — deployed to GitHub Pages.

## Project structure

```
/
├── index.html              # Semantic shell; sections rendered by JS
├── data.json               # Single source of truth for all content
├── sitemap.xml
├── robots.txt
├── .nojekyll
├── assets/
│   ├── css/                # main.css, components.css, animations.css
│   ├── js/                 # renderer.js, main.js, animations.js
│   ├── images/
│   └── lottie/
└── .github/workflows/
    └── deploy.yml          # Auto-deploy on push to main
```

## Update content

Edit `data.json`, commit, and push to `main`. GitHub Actions deploys automatically.

No HTML changes needed for content updates.

## Local development

```bash
python3 -m http.server 8080
# or
npx serve .
```

Open [http://localhost:8080](http://localhost:8080).

## GitHub Pages setup

After pushing, enable Pages in repo settings:

1. **Settings → Pages → Build and deployment**
2. Source: **GitHub Actions**

The workflow in `.github/workflows/deploy.yml` handles deployment on every push to `main`.

## Repo topics (GitHub)

Suggested topics: `portfolio`, `backend`, `python`, `fastapi`, `devops`, `software-engineer`, `systems`
