# Bockle Public Support Site (GitHub Pages)

This folder contains the public website required for Apple App Store Connect:

- Support URL page: `index.html`
- Privacy Policy URL page: `privacy.html`
- Terms of Service page: `terms.html`

## Files

- `index.html` - public support page with contact details and links
- `privacy.html` - privacy policy
- `terms.html` - terms of service
- `styles.css` - shared site styling

## Required Manual Edits Before Publishing

1. Replace all placeholder support emails:
   - `support@example.com` in `index.html`
   - `support@example.com` in `privacy.html`
   - `support@example.com` in `terms.html`
2. Complete all `TODO` comments in policy/terms content.
3. Confirm legal entity name, jurisdiction, and contact details.
4. Verify privacy statements match App Store Connect privacy answers.

## Publish On GitHub Pages

Use one of the two methods below.

### Method A: Deploy from `main` branch `/docs` folder

1. Push this repository to GitHub.
2. In GitHub, open: `Settings` -> `Pages`.
3. Under `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
4. Save and wait for deployment.
5. Confirm the published site URL shown in Pages settings.

### Method B: Deploy from a dedicated Pages branch

1. Create/push a branch containing this `docs` directory.
2. In GitHub `Settings` -> `Pages`, select that branch and `/docs` (or `/root` if docs content is moved).
3. Save and wait for deployment.

## App Store Connect URLs

After deployment, replace `<username>` with your GitHub username:

- Support URL:
  `https://<username>.github.io/bockle/`
- Privacy Policy URL:
  `https://<username>.github.io/bockle/privacy.html`

If your repository name changes, update `bockle` in the URLs accordingly.

## Quick Validation Checklist

1. Open all public URLs in mobile and desktop browsers.
2. Confirm Support page includes a working support email.
3. Confirm Privacy Policy is publicly reachable without login.
4. Confirm Terms page is linked from Support and Privacy pages.
5. Ensure no placeholder email or unresolved `TODO` remains.
