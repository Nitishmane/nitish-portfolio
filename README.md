# nitish-portfolio

Personal portfolio. Static HTML/CSS/JS with **no build step**, deployed on
Cloudflare Pages from this GitHub repository.

```
Visitor → Cloudflare DNS → Cloudflare Pages → this GitHub repo (main)
```

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site: one page, seven sections |
| `styles.css` | Design tokens, layout, components, light/dark themes |
| `main.js` | Theme toggle, scroll reveal, active nav link |
| `404.html` | Served automatically by Pages on unknown paths |
| `_headers` | Security headers + cache policy (Pages-specific) |
| `_redirects` | Vanity shortlinks like `/resume` (Pages-specific) |
| `robots.txt`, `sitemap.xml` | Search indexing |
| `assets/` | `favicon.svg`, `resume.pdf`, `og.png` |

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

## Content checklist

Résumé content is in. Remaining:

- [ ] `assets/resume.pdf`, without which the `/resume` shortlink and both Résumé buttons 404
- [ ] `assets/og.png` (1200×630 social preview image)
- [ ] Confirm the public contact address; Cloudflare Email Routing can forward
      `hello@nitishmane.dev` to a personal inbox for free
