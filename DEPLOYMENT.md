# Deployment Guide

This guide will help you deploy the Evangadi Forum application to Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub repository with your project
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- MySQL database (can be created on Render or use external service like Railway, PlanetScale, etc.)

## Architecture

- **Frontend**: React app deployed on Vercel
- **Backend**: Express.js API deployed on Render
- **Database**: MySQL (hosted on Render or external service)

---

## Step 1: Deploy Backend to Render

### 1.1 Create MySQL Database on Render

1. Go to https://render.com and sign in
2. Click "New" → "PostgreSQL" (or use external MySQL service)
3. Create a new database and note down:
   - Database URL or individual credentials (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT)

### 1.2 Deploy Backend Service

1. In Render dashboard, click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `evangadi-forum-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-a-secure-random-string>
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_HOST=<your-database-host>
   DB_NAME=<your-database-name>
   DB_PORT=3306
   ```

   **OR** if using Render's MySQL or Railway:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-a-secure-random-string>
   MYSQL_URL=mysql://user:password@host:port/database
   ```

5. Click "Create Web Service"
6. Wait for deployment to complete
7. Note your backend URL (e.g., `https://evangadi-forum-backend.onrender.com`)

### 1.3 Initialize Database

After deployment, visit:
```
https://your-backend-url.onrender.com/create-table
```

This will create the necessary database tables.

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Configuration

Before deploying, update the `vercel.json` file with your actual backend URL:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-BACKEND-URL.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/client/dist/$1"
    }
  ]
}
```

Replace `https://YOUR-BACKEND-URL.onrender.com` with your actual Render backend URL.

### 2.2 Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   
   This ensures the frontend connects to your Render backend.

6. Click "Deploy"
7. Wait for deployment to complete
8. Your app will be available at `https://your-project.vercel.app`

---

## Step 3: Update CORS Configuration

After deployment, update the CORS configuration in `app.js` to include your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:3000', 
    'https://your-project.vercel.app',  // Add your Vercel URL
    'https://evangadiforum.goodtess.com'
  ],
  credentials: true
}));
```

Commit and push this change to trigger a new deployment on Render.

---

## Step 4: Verify Deployment

1. Visit your Vercel URL
2. Test the following:
   - User registration
   - User login
   - Creating questions
   - Posting answers
   - All CRUD operations

---

## Alternative: Deploy Entire App on Render

If you prefer to deploy both frontend and backend on Render:

1. Deploy the backend as described in Step 1
2. In Render, create a new "Static Site"
3. Connect your repository
4. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

---

## Environment Variables Summary

### Backend (Render)
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `JWT_SECRET` = `<secure-random-string>`
- `DB_USER` = `<database-username>`
- `DB_PASSWORD` = `<database-password>`
- `DB_HOST` = `<database-host>`
- `DB_NAME` = `<database-name>`
- `DB_PORT` = `3306`

**OR** use:
- `MYSQL_URL` = `mysql://user:password@host:port/database`

### Frontend (Vercel)
- `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

---

## Troubleshooting

### CORS Errors
- Ensure your Vercel domain is added to the CORS whitelist in `app.js`
- Check that `VITE_API_URL` is correctly set in Vercel

### Database Connection Issues
- Verify database credentials in Render environment variables
- Ensure database allows connections from Render's IPs
- Check database is running and accessible

### Build Failures
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel/Render dashboard
- Verify Node.js version compatibility

### API Not Found (404)
- Verify API routes are correctly configured
- Check that backend is running and accessible
- Ensure `VITE_API_URL` points to correct backend URL

---

## Custom Domain (Optional)

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render
1. Go to your web service settings
2. Click "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## Notes

- Render free tier may spin down after inactivity (cold starts)
- Vercel free tier has generous limits for hobby projects
- Consider upgrading to paid plans for production use
- Always use environment variables for sensitive data
- Never commit `.env` files to version control