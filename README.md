# nitish-portfolio

Personal portfolio. Static HTML/CSS/JS with **no build step**, deployed on
Cloudflare Pages from this GitHub repository.

```
Visitor → Cloudflare DNS → Cloudflare Pages → this GitHub repo (main)
```

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site — one page, five sections |
| `styles.css` | Design tokens, layout, components, light/dark themes |
| `main.js` | Theme toggle, scroll reveal, active nav link |
| `404.html` | Served automatically by Pages on unknown paths |
| `_headers` | Security headers + cache policy (Pages-specific) |
| `_redirects` | Vanity shortlinks like `/resume` (Pages-specific) |
| `robots.txt`, `sitemap.xml` | Search indexing |
| `assets/` | `favicon.svg`, `resume.pdf`, `og.png` |

## Local preview

No toolchain needed — open `index.html` in a browser, or serve it so that
root-absolute paths (`/styles.css`) resolve:

```sh
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deploy: Cloudflare Pages

One-time setup, in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**
2. Authorize GitHub and pick `Nitishmane/nitish-portfolio`
3. Build settings — this is a no-build site, so leave them empty:
   - Framework preset: **None**
   - Build command: *(empty)*
   - Build output directory: **`/`**
4. **Save and Deploy**

Every push to `main` then redeploys automatically. Pull requests get their own
preview URL. The production site lives at `<project-name>.pages.dev` until a
custom domain is attached.

## Deploy: custom domain (once registered)

Register the domain, then:

1. **Cloudflare dashboard → Add a site** → enter the domain → free plan
2. Cloudflare shows two nameservers; set them at the registrar. Propagation is
   usually minutes, occasionally up to 24h.
3. Once the zone is active: **Workers & Pages → your project → Custom domains →
   Set up a custom domain** → add `example.com`, then repeat for `www.example.com`.
   Pages creates the DNS records itself — do **not** hand-create A/CNAME records for it.
4. TLS is issued automatically. Under **SSL/TLS**, set encryption mode to **Full (strict)**.
5. Pick one canonical host and redirect the other with a **Redirect Rule**
   (e.g. `www.example.com/*` → `https://example.com/$1`, 301).

Then update the domain placeholders in `index.html` (canonical + Open Graph),
`robots.txt`, and `sitemap.xml`.

## Content checklist

Placeholders are marked `TODO` in the HTML and rendered with a highlighted
background by the `.ph` class. Delete the `class="ph"` attributes and the `.ph`
rule in `styles.css` once real content is in.

- [ ] Hero: location, role line, lede paragraph
- [ ] Social links: LinkedIn URL, public contact email
- [ ] About: two paragraphs + skills tags
- [ ] Experience: one `<li class="role">` per role, newest first
- [ ] Projects: three to six `<article class="card">`
- [ ] Contact: email address
- [ ] `assets/resume.pdf`
- [ ] `assets/og.png` (1200×630 social preview image)
- [ ] Replace `TODO-your-domain.com` everywhere
