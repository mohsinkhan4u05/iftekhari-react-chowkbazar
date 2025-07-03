# Blog Comments Functionality

## Overview
The blog comment system allows authenticated users to post comments and replies on blog articles. Comments support nested replies and are automatically approved for authenticated users.

## Features

### ✅ **Implemented Features**
- **User Authentication**: Only authenticated users can post comments
- **Nested Replies**: Support for threaded comments up to multiple levels
- **Real-time Updates**: Comments appear immediately after posting
- **Comment Count Display**: Shows comment count on blog cards and detail pages
- **Auto-approve**: Comments from authenticated users are auto-approved
- **Responsive Design**: Mobile-friendly comment interface
- **Author Attribution**: Shows commenter name and timestamp

### 🔧 **Database Schema**

#### BlogComments Table
```sql
CREATE TABLE Iftekhari.BlogComments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    blogPostId INT NOT NULL,
    parentCommentId INT NULL, -- For reply functionality
    authorName NVARCHAR(255) NOT NULL,
    authorEmail NVARCHAR(255) NOT NULL,
    content NTEXT NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
    createdAt DATETIME2 DEFAULT GETDATE() NOT NULL,
    updatedAt DATETIME2 DEFAULT GETDATE() NOT NULL
);
```

#### BlogPosts Table (Updated)
- Added `commentCount INT DEFAULT 0 NOT NULL` column

### 📁 **File Structure**

```
src/
├── components/blog/
│   ├── Comment.tsx              # Individual comment component
│   ├── CommentsSection.tsx      # Main comments container
│   ├── BlogCard.tsx             # Updated with comment count
│   └── BlogDetail.tsx           # Updated with comment count
├── pages/api/blogs/
│   └── [slug]/
│       ├── comments.ts          # Comments CRUD API
│       └── view.ts              # View count tracking
├── hooks/
│   └── useViewTracker.ts        # View tracking hook
└── database/
    └── create_blog_comments.sql # Database setup script
```

### 🚀 **API Endpoints**

#### GET `/api/blogs/[slug]/comments`
- **Purpose**: Fetch all approved comments for a blog post
- **Response**: Hierarchical list of comments with replies
- **Authentication**: Not required for reading

#### POST `/api/blogs/[slug]/comments`
- **Purpose**: Create a new comment or reply
- **Authentication**: Required
- **Body**:
  ```json
  {
    "content": "Comment text",
    "parentCommentId": 123 // Optional, for replies
  }
  ```

### 🎨 **Components**

#### CommentsSection
- Main container for all comment functionality
- Handles comment form and comment list
- Shows sign-in prompt for unauthenticated users
- Manages comment state and API calls

#### Comment
- Individual comment display component
- Supports nested replies
- Show/hide replies functionality
- Reply form integration

### 🔒 **Security Features**

1. **Authentication Required**: Only authenticated users can comment
2. **SQL Injection Protection**: Parameterized queries
3. **Content Validation**: Comment content is validated and trimmed
4. **Email Privacy**: Author emails are not exposed in API responses

### 🎯 **Usage Examples**

#### Display Comments Section
```tsx
import CommentsSection from '../components/blog/CommentsSection';

<CommentsSection 
  blogSlug="my-blog-post" 
  commentCount={5} 
/>
```

#### Comment Structure
```typescript
interface CommentData {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  level: number;
  parentCommentId?: number;
}
```

### 📊 **Comment Statistics**

Comments are automatically counted and displayed:
- **Blog List Page**: Shows comment count on each blog card
- **Blog Detail Page**: Shows comment count in meta information
- **Comments Section**: Shows total count in section header

### 🔄 **Future Enhancements**

Potential improvements that could be added:
- **Comment Moderation**: Admin interface for comment approval
- **Comment Editing**: Allow users to edit their own comments
- **Comment Voting**: Like/dislike functionality
- **Comment Notifications**: Email notifications for replies
- **Rich Text Comments**: Support for markdown or rich text
- **Comment Reactions**: Emoji reactions to comments
- **Comment Search**: Search within comments
- **Comment Reporting**: Report inappropriate comments

### 🐛 **Troubleshooting**

#### Comments Not Appearing
1. Check if user is authenticated
2. Verify blog post exists and slug is correct
3. Check database connection
4. Ensure comments API endpoint is accessible

#### Comment Count Not Updating
1. Verify the comment was successfully saved
2. Check if comment count trigger is working
3. Refresh the page to see updated counts

#### Database Issues
1. Run the database setup script: `database/create_blog_comments.sql`
2. Ensure foreign key constraints are properly set
3. Check database user permissions

### 🧪 **Testing**

To test the comment functionality:
1. Create a blog post
2. Sign in as a user
3. Navigate to the blog detail page
4. Post a comment
5. Reply to the comment
6. Check comment counts on blog list page

### 📝 **Notes**

- Comments are auto-approved for authenticated users
- Parent comment validation ensures reply integrity  
- Comment threading is limited by CSS styling (max depth for readability)
- All timestamps are stored in UTC and formatted for display
- Comment content supports line breaks but not HTML
