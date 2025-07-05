# Deployment Checklist for Image Uploads

## Server Configuration Requirements

### 1. Directory Permissions
Ensure the uploads directory has proper permissions:

```bash
# On your server, run:
mkdir -p /path/to/your/app/public/uploads
chmod 755 /path/to/your/app/public/uploads
chown www-data:www-data /path/to/your/app/public/uploads  # if using apache/nginx
```

### 2. Nginx Configuration (if using Nginx)
Add this to your Nginx configuration:

```nginx
server {
    # ... your existing config

    # Serve static files from uploads directory
    location /uploads/ {
        alias /path/to/your/app/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Optional: Add security headers
        add_header X-Content-Type-Options nosniff;
        
        # Handle missing files gracefully
        try_files $uri =404;
    }
    
    # ... rest of your config
}
```

### 3. Apache Configuration (if using Apache)
Add to your .htaccess or virtual host config:

```apache
# Serve uploads directory
<Directory "/path/to/your/app/public/uploads">
    Options -Indexes
    AllowOverride None
    Require all granted
    
    # Set cache headers
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </FilesMatch>
</Directory>
```

### 4. Environment Variables
Make sure these are set in production:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.silsilaeiftekhari.in
```

### 5. File Upload Limits
Check your server's file upload limits:

**PHP (if applicable):**
```ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
```

**Nginx:**
```nginx
client_max_body_size 10M;
```

### 6. Troubleshooting Commands

Run these on your server to diagnose issues:

```bash
# Check if uploads directory exists and permissions
ls -la /path/to/your/app/public/uploads/

# Check disk space
df -h

# Check if specific file exists
ls -la /path/to/your/app/public/uploads/vyddk28ue321g2jd6srjd8fhp.PNG

# Test file serving directly
curl -I https://www.silsilaeiftekhari.in/uploads/test-file.jpg

# Check server logs for errors
tail -f /var/log/nginx/error.log  # or your web server's error log
```

### 7. Development vs Production Differences

**Local Development:**
- Next.js dev server serves static files automatically
- Files in `public/` directory are accessible at root URL

**Production:**
- Static files might need explicit server configuration
- Permissions and ownership matter
- Caching headers should be set properly

### 8. Backup Strategy

```bash
# Backup uploads directory regularly
rsync -av /path/to/your/app/public/uploads/ /backup/location/uploads/
```

## Testing Checklist

- [ ] Can upload new images through the form
- [ ] Uploaded images are accessible via direct URL
- [ ] Images display correctly in the application
- [ ] No console errors related to image loading
- [ ] Proper cache headers are set
- [ ] File permissions are correct (644 for files, 755 for directories)
