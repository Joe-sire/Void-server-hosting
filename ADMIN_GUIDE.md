# Admin Management Guide

## 🎯 How to Grant Admin Access

Your Minecraft hosting website now has a **User Management Page** built directly into the admin panel!

### Step-by-Step Instructions:

#### 1. **Sign In with Google**
   - Go to your website and click "Sign In"
   - Use your Google account to authenticate
   - You'll be redirected to your dashboard

#### 2. **First User Becomes Admin**
   - The very first user who signs in needs to be made admin manually
   - Ask E1 (the AI agent) to run this command for you:
     ```
     Please make my email (your-email@gmail.com) an admin user
     ```
   - Or you can add your email to the whitelist in `/app/backend/auth.py`:
     ```python
     ADMIN_EMAILS = [
         "your-email@gmail.com",  # Your email here
     ]
     ```

#### 3. **Access User Management**
   - Once you're an admin, go to the **Admin Panel**
   - Click the **"Manage Users"** button in the top right
   - You'll see a list of all users who have signed in

#### 4. **Grant or Revoke Admin Access**
   - Find the user in the list
   - Click on their role badge (User/Admin) to toggle
   - Admin users get a purple "Admin" badge with a crown icon
   - Regular users get a "User" badge

### 🔒 Security Notes:

- **Users must sign in first** before they appear in the user management list
- **You cannot change your own role** for security reasons
- **Admin users can**:
  - Access the Admin Panel
  - Manage all website content (plans, features, FAQs)
  - Grant/revoke admin access to other users
  - View and manage all user servers

### 📸 What It Looks Like:

The User Management page shows:
- User avatars (initials)
- Full name and email
- Join date
- Current role (User or Admin)
- Toggle button to change roles

### 🚀 Quick Start:

1. Sign in with your Google account
2. Ask E1 to make you an admin
3. Go to Admin Panel → Manage Users
4. Toggle roles with a single click!

---

## Alternative Methods (For Reference)

### Method A: Email Whitelist (Auto-assign)
Edit `/app/backend/auth.py` and add emails:
```python
ADMIN_EMAILS = [
    "admin1@example.com",
    "admin2@example.com",
]
```
Restart backend: `sudo supervisorctl restart backend`

### Method B: Management Script (Requires Terminal)
```bash
cd /app/backend
python manage_admins.py add email@example.com
python manage_admins.py list
```

---

**Recommendation:** Use the built-in User Management page - it's the easiest method!
