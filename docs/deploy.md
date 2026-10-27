# Deploying

Two ways to publish: your own hosting, or GitHub Pages. Both start the same.

## First: make it yours

1. Click **Use this template** on GitHub, then *Create a new repository*.
2. Clone it and install ([Node.js](https://nodejs.org) 22 or newer):
   ```bash
   git clone https://github.com/YOUR-USER/YOUR-REPO.git
   cd YOUR-REPO
   npm install
   npm start
   ```
   Open `http://localhost:8080` and work with a live preview.
3. Edit `src/_data/site.js`: name, **final address** (`url`), menu, links.
4. Delete the example photos in `src/images/galleries/`, export yours there in folders with numbered names (`portraits-001.jpg`, ...), and show each one with `{% gallery "portraits" %}`.

Then pick one way.

---

## A. Your own hosting

1. `npm run build` creates the **`dist/`** folder: the whole site.
2. Upload the **contents** of `dist/` to your public folder (often `public_html`). With an SFTP program (free, open-source and popular: [FileZilla](https://filezilla-project.org) for Windows, macOS and Linux; [Cyberduck](https://cyberduck.io) for Windows and macOS; [WinSCP](https://winscp.net) for Windows), or with rsync:
   ```bash
   rsync -av --delete dist/ user@your-server:/path/to/public_html/
   ```
3. Point your domain to the hosting (your provider explains how).
4. Apache server? The included `.htaccess` adds compression and caching. Any other: not needed.

Every change: build, upload again.

Using `rsync --delete` with the CV PDF? Build on a machine with Chrome, Edge or Chromium, or set `CV_PDF_REQUIRED=1` so a missing PDF stops the build instead of deleting the old one on the server.

---

## B. GitHub Pages

Free, and it publishes by itself. Needs a **public** repository, and either a **custom domain** or a repository named `YOUR-USER.github.io`. In a sub-path (`your-user.github.io/your-repo`) the styles break.

1. **Turn Pages on.** *Settings > Pages > Build and deployment > Source*: **GitHub Actions**.
2. **Set your address.** *Settings > Secrets and variables > Actions > Variables > New repository variable*: name `SITE_URL`, value your final address, e.g. `https://example.com` (no trailing slash). Optional: `NOINDEX` = `1` asks search engines to skip the site, handy for a demo.
3. **Push.** Send your changes to GitHub with [GitHub Desktop](https://desktop.github.com) (free, for Windows and Mac) or `git push` to `main`. The included workflow (`.github/workflows/pages.yml`) does the rest. Nothing to edit.
4. **Watch it.** *Actions* tab: yellow while running, green after about 3 minutes.
5. **Custom domain.** At your domain provider, add a **CNAME** record pointing to `YOUR-USER.github.io` (e.g. name `www`). Then *Settings > Pages > Custom domain*: enter it, *Save*. When GitHub verifies the DNS, tick **Enforce HTTPS**.

Done. Every push to `main` publishes again. To publish without a new commit: *Actions > Deploy to GitHub Pages > Run workflow*.

Nothing happens until you set `SITE_URL`, so a fresh copy of the template never shows a red cross.
