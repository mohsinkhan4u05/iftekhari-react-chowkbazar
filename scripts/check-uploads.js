const fs = require('fs');
const path = require('path');

// Check if uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public/uploads');
console.log('Checking uploads directory:', uploadsDir);

try {
  if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists');
    
    // Check permissions
    const stats = fs.statSync(uploadsDir);
    console.log('Directory permissions:', stats.mode.toString(8));
    
    // List files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    console.log('Files in uploads directory:', files.length);
    
    if (files.length > 0) {
      console.log('Sample files:', files.slice(0, 5));
    }
  } else {
    console.log('❌ Uploads directory does not exist');
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
    console.log('✅ Uploads directory created');
  }
} catch (error) {
  console.error('Error checking uploads directory:', error);
}
