# Deploying PHP App to Digital Ocean App Platform

## Quick Deploy (5 minutes)

### Step-by-Step Guide

1. **Go to Digital Ocean App Platform**
   - Visit: https://cloud.digitalocean.com/apps
   - Click "Create App"

2. **Connect GitHub Repository**
   - Select "GitHub" as source
   - Authorize DO to access your GitHub (if first time)
   - Select repository: `experiments.martinmakarsky.com`
   - Select branch: `main`

3. **Configure the App**
   - DO should auto-detect it's a PHP app
   - **Source Directory**: Set to `php-app` ⚠️ **IMPORTANT**
   - **Build Command**: Leave empty (no build step needed)
   - **Run Command**: Leave empty (PHP files are served directly)
   - **HTTP Port**: `8080` (DO default)

4. **Configure Routes**
   - Default route `/` should be set automatically
   - This routes all requests through `index.php`

5. **Review & Deploy**
   - Review the configuration
   - Click "Create Resources"
   - Wait 2-3 minutes for deployment
   - Done! 🎉

---

## Important Configuration

### Source Directory
**CRITICAL**: Set `Source Directory` to `php-app` (not root!)

This tells DO where your PHP files are located in the monorepo.

### No Build/Run Commands Needed
Since this is a simple PHP app with no dependencies:
- **Build Command**: Leave empty
- **Run Command**: Leave empty

DO will automatically serve PHP files.

---

## Post-Deployment

### 1. Test Your App
Visit: `https://your-app-name.ondigitalocean.app/signin`

### 2. Set Environment Variables (Optional)

If you want to use environment variables for Turnstile:

1. Go to your app → Settings → App-Level Environment Variables
2. Add:
   - `TURNSTILE_SITE_KEY` = `0x4AAAAAACGw49uNJoXVhVS5`
   - (Optional) `TURNSTILE_SECRET_KEY` = your secret key

### 3. Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain (e.g., `php.experiments.martinmakarsky.com`)
3. DO will provide DNS records to add to your domain

---

## Troubleshooting

### Issue: 404 errors on routes
**Solution**: 
- Check that `Source Directory` is set to `php-app`
- Verify `index.php` exists in the deployed files
- Check deployment logs in DO dashboard

### Issue: Images not loading
**Solution**: 
- Verify `images/` folder is included (should be automatic)
- Check file paths in `signin.php` (should be relative: `images/...`)

### Issue: Routes not working
**Solution**: 
- DO uses Nginx, not Apache
- The `.htaccess` file might not work
- DO should automatically route through `index.php` if configured correctly
- Check the deployment logs for any errors

### Issue: PHP errors
**Solution**:
- Check deployment logs in DO dashboard
- Verify PHP version (DO uses PHP 8.x by default)
- Check that all files are included in deployment

---

## File Structure

DO needs these files:
```
php-app/
├── index.php          ✅ (router - required)
├── signin.php         ✅ (signin page - required)
├── images/            ✅ (static assets - required)
│   └── lumon-globe-logo.svg
├── router.php         ⚠️ (only for local dev, not needed in DO)
└── .htaccess          ⚠️ (Apache only, DO uses Nginx)
```

**Note**: `router.php` and `.htaccess` are for local development. DO doesn't need them.

---

## Cost

- **Basic App**: $5/month (minimum)
- **With Custom Domain**: $0/month (included)
- **Total**: **$5/month** 💰

---

## Auto-Deploy

Once configured:
- ✅ Every push to `main` branch = automatic deployment
- ✅ Deployment takes ~2-3 minutes
- ✅ View logs in DO dashboard
- ✅ Rollback available if needed

---

## Using app.yaml (Advanced)

If you want to use the `.do/app.yaml` file for configuration:

1. The file is at `php-app/.do/app.yaml`
2. When connecting the repo, DO will detect it
3. It will use the YAML config instead of manual setup

**Note**: You can also configure everything via the dashboard and ignore the YAML file.

---

## Next Steps

1. ✅ Deploy the app
2. ✅ Test: `https://your-app.ondigitalocean.app/signin`
3. ✅ Test form submission
4. ✅ (Optional) Add custom domain
5. ✅ (Optional) Set environment variables

---

## Quick Checklist

- [ ] Source Directory set to `php-app`
- [ ] Build Command: empty
- [ ] Run Command: empty
- [ ] Route configured: `/`
- [ ] GitHub repo connected
- [ ] Branch: `main`
- [ ] Deploy on push: enabled

---

## Support

If you encounter issues:
1. Check deployment logs in DO dashboard
2. Verify file structure matches what's in the repo
3. Check that `index.php` is the entry point
4. Review DO App Platform docs: https://docs.digitalocean.com/products/app-platform/
