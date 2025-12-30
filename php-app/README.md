# Minimal PHP Signin Application

**Zero dependencies** - Just plain PHP. No Laravel, no Composer, no framework.

## Files

- `index.php` - Simple router (handles `/signin` GET and `/api/signin` POST)
- `router.php` - Router script for PHP's built-in development server
- `signin.php` - Signin page HTML with Turnstile integration
- `images/lumon-globe-logo.svg` - Logo asset
- `.htaccess` - Optional Apache rewrite rules for clean URLs
- `start.sh` - Convenience script to start the server

## Requirements

- **PHP 8.2+** (that's it! No other dependencies)
- Web server (Apache/Nginx) or PHP built-in server

## Quick Start

### Using PHP Built-in Server

**Important:** You MUST run the command from the `php-app` directory, or use the start script.

**Option 1: Use the start script (recommended)**
```bash
cd php-app
./start.sh
```

**Option 2: Manual command**
```bash
cd php-app
php -S localhost:8000 router.php
```

**Option 3: With full path (if running from different directory)**
```bash
php -S localhost:8000 /full/path/to/php-app/router.php
```

Then visit: `http://localhost:8000/signin` or `http://localhost:8000/`

**Why the router?** PHP's built-in server doesn't use `.htaccess`, so we need `router.php` to route requests to `index.php`.

### Using Apache/Nginx

1. Point your web server document root to the `php-app/` directory
2. Ensure `.htaccess` is enabled (Apache) or configure similar rewrite rules (Nginx)
3. Visit your domain/signin

## Deployment to Digital Ocean

1. Upload all files from `php-app/` to your server
2. Point your web server to the directory
3. **That's it!** No `composer install`, no `npm install`, no database setup

## What Makes This Minimal?

✅ **Zero dependencies** - No Composer packages  
✅ **No framework** - Just plain PHP  
✅ **No build step** - No webpack, vite, or bundlers  
✅ **No database** - No migrations or SQL setup  
✅ **No config files** - Everything is in the code  
✅ **Tiny footprint** - ~10 KB total (excluding images)  

## Project Structure

```
php-app/
├── index.php          # Router (70 lines)
├── router.php          # PHP built-in server router
├── signin.php         # Signin page (191 lines)
├── images/
│   └── lumon-globe-logo.svg
├── .htaccess          # Apache rewrite rules (optional)
├── start.sh           # Start script
└── README.md          # This file
```

## Features

- ✅ Signin form with email/password
- ✅ Cloudflare Turnstile integration (lazy-loaded)
- ✅ Error and success message handling
- ✅ Responsive design (Tailwind CSS via CDN)
- ✅ Same functionality as the Next.js version

## Notes

- Turnstile verification is currently a stub (always returns true)
- To enable real Turnstile verification, uncomment the code in `index.php` and add your secret key
- All styling uses Tailwind CSS via CDN (no build step needed)

## Troubleshooting

**Error: "Failed opening required 'router.php'"**
- Make sure you're running the command from the `php-app` directory
- Or use the full path: `php -S localhost:8000 /full/path/to/php-app/router.php`
- Or use the `start.sh` script which handles this automatically

**404 errors**
- Make sure you're using `router.php` as the router script
- Don't run `php -S localhost:8000` without the router parameter
