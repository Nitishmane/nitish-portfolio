# nitish-portfolio

Personal portfolio. Static HTML/CSS/JS with **no build step**, deployed on
Cloudflare Workers static assets from this GitHub repository.

```
Visitor → Cloudflare DNS → Cloudflare Workers (static assets) → this GitHub repo (main)
```

Live at `nitish-portfolio.manenitish06.workers.dev` until the custom domain is
attached.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site: one page, seven sections |
| `styles.css` | Design tokens, layout, components, light/dark themes |
| `main.js` | Theme toggle, scroll reveal, active nav link |
| `404.html` | Served automatically by Pages on unknown paths |
| `_headers` | Security headers + cache policy (Pages-specific) |
| `_redirects` | Vanity shortlinks like `/github` (Pages-specific) |
| `robots.txt`, `sitemap.xml` | Search indexing |
| `assets/` | `favicon.svg`, `og.png` |
| `.tools/` | Source for the OG image; excluded from the deploy by `.assetsignore` |
| `.assetsignore` | Files that must not be published, `.git` above all |
| `wrangler.jsonc` | Worker name and the 404 handling Pages would have done for free |

## Local preview

No toolchain needed. Open `index.html` in a browser, or serve it so that
root-absolute paths (`/styles.css`) resolve:

```sh
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deploy: Cloudflare Pages

One-time setup, in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**
2. Authorize GitHub and pick `Nitishmane/nitish-portfolio`
3. Build settings. This is a no-build site, so leave them empty:
   - Framework preset: **None**
   - Build command: *(empty)*
   - Build output directory: **`/`**
4. **Save and Deploy**

### Workers static assets, and why the two extra files exist

The dashboard may create this as a **Worker** rather than a Pages project. The
two behave differently in ways that matter here:

| | Pages | Workers static assets |
| --- | --- | --- |
| Dotfiles (`.git/`) | skipped automatically | **uploaded and served** unless `.assetsignore` excludes them |
| `404.html` | served automatically | only with `not_found_handling: "404-page"` |
| `_headers`, `_redirects` | supported | supported |

`.assetsignore` and `wrangler.jsonc` cover both gaps. Do not delete them: without
`.assetsignore` the entire `.git` directory becomes publicly fetchable.

Every push to `main` then redeploys automatically. Pull requests get their own
preview URL. The production site lives at `nitish-portfolio.pages.dev` until a
custom domain is attached (see below).

## Deploy: custom domain, nitishmane.dev (registered at Name.com)

The domain is registered at Name.com; DNS moves to Cloudflare so that Pages can
manage the records and issue TLS.

**1. Add the zone to Cloudflare**

Cloudflare dashboard → **Add a site** → `nitishmane.dev` → Free plan. Cloudflare
scans existing records and shows you two assigned nameservers, e.g.
`xxx.ns.cloudflare.com` / `yyy.ns.cloudflare.com`.

**2. Repoint the nameservers at Name.com**

Name.com → **My Domains** → `nitishmane.dev` → **Nameservers** → *Manage
Nameservers*. Remove the Name.com defaults (`ns1.name.com` … `ns4.name.com`) and
enter the two Cloudflare nameservers. Save.

Propagation is usually 5–60 minutes. Cloudflare emails you when the zone goes
active; `dig NS nitishmane.dev +short` confirms it from the terminal.

**3. Attach the domain to the Pages project**

Workers & Pages → `nitish-portfolio` → **Custom domains** → *Set up a custom
domain*:

- add `nitishmane.dev`
- add `www.nitishmane.dev`

Pages creates the DNS records itself, so do **not** hand-create A or CNAME records
for these, and delete any parking records Name.com left behind.

**4. TLS and canonical host**

- **SSL/TLS → Overview**: set encryption mode to **Full (strict)**.
- **SSL/TLS → Edge Certificates**: enable **Always Use HTTPS**.
- `.dev` is on the HSTS preload list, so browsers *require* HTTPS for this
  domain; there is no working http:// fallback. That is fine here, but it means
  the certificate must be live before the site loads at all.
- Canonicalize on the apex: **Rules → Redirect Rules** → new rule,
  `Hostname equals www.nitishmane.dev` → dynamic redirect to
  `concat("https://nitishmane.dev", http.request.uri.path)`, status **301**.

**5. Optional: email at the domain**

Cloudflare **Email Routing** gives you `hello@nitishmane.dev` forwarding to a
personal inbox for free, which is nicer on a portfolio than a raw Gmail address.
It adds its own MX records automatically.

## Regenerating the social image

`assets/og.png` is a Chrome screenshot of `.tools/og-image.html`, so it uses the
same fonts and palette as the site. After editing the role or blurb in that file:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
  --screenshot=assets/og.png --window-size=1200,630 \
  "file://$PWD/.tools/og-image.html"
```

Chrome pulls Instrument Serif and Inter from Google Fonts at render time, so run
it online; offline it silently falls back to Georgia and Helvetica.

## Remaining

- [ ] `assets/resume.pdf`. The résumé buttons and the `/resume` and `/cv`
      shortlinks were removed rather than left pointing at a missing file.
      Restore all three once a PDF is in place, ideally one without the phone
      number and visa status on it.
- [ ] Confirm the public contact address; Cloudflare Email Routing can forward
      `hello@nitishmane.dev` to a personal inbox for free.
