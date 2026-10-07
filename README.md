# KS Interio — GitHub Pages

This folder is ready to use as the root of a GitHub repository. No build, Node.js server or installation is required.

```text
index.html
styles.css
app.js
assets/
robots.txt
sitemap.xml
.nojekyll
```

## Upload and publish

1. Upload all the contents of this folder to your GitHub repository, keeping `assets/` intact. `index.html` must appear directly in the repository root.
2. In Settings → Pages, select Deploy from a branch → main → / (root), then Save.
3. Wait for the Pages deployment to finish and use the link shown in Settings → Pages.

The ZIP contains these files directly at its root. Extract the ZIP before uploading; do not upload the ZIP itself as the website.

All CSS, JavaScript, image and font paths are relative, so they support a GitHub Pages repository subpath.

## SEO when moving hosting

Canonical, social sharing, structured-data and sitemap URLs currently point to `https://ks-interio.iammsumit.chatgpt.site/`. Once your final GitHub Pages or custom-domain URL is known, update those absolute URLs in `index.html`, `robots.txt` and `sitemap.xml` to that exact base URL (including the repository path for a project site). Relative asset paths do not need changing.

## Contact form

The form validates the enquiry and opens WhatsApp with the details prepared. The visitor taps Send in WhatsApp to send the message. GitHub Pages does not need a backend for this flow.

Business details and media provenance are recorded in `ASSET-SOURCES.md`; third-party licenses remain inside `assets/`.

## Instagram and portfolio

The portfolio contains 40 photo-post covers from @ksinterio, excluding the furniture-only entries requested for removal. Eight appear initially; Load more reveals the remaining 32 in aligned rows. Category filters have their own Load more state. Thumbnails fill their frames; each detail dialog displays the full image and links to the original post for additional carousel slides. The journal retains six photo tiles and two reel buttons. Photos are local optimized WebP files with lazy loading; this is a dated snapshot, not an automatic Instagram sync. Reel players load on demand and may require Instagram login.

## Testimonials

The original testimonial layout now has three verified Google review excerpts with previous/next, dots, a counter and keyboard controls. Reviews do not auto-advance. The overall Google rating remains 4.1/5 from 18 reviews, checked on 6 October 2026.
