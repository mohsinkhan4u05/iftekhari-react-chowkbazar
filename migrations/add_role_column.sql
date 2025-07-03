-- Add Role column to IftekhariUsers table
ALTER TABLE Iftekhari.IftekhariUsers 
ADD Role NVARCHAR(50) DEFAULT 'user' NOT NULL;

-- Update existing users to have 'admin' role for specific emails (replace with your admin emails)
-- UPDATE Iftekhari.IftekhariUsers 
-- SET Role = 'admin' 
-- WHERE Email IN ('admin@example.com', 'youremail@gmail.com');

-- Create index on Role column for better performance
CREATE INDEX IX_IftekhariUsers_Role ON Iftekhari.IftekhariUsers(Role);
