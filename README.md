# Evangadi Forum

A full-stack forum application built with Node.js, Express, React, and MySQL.

## Features

- User registration and authentication
- JWT-based authentication
- Question and answer system
- Responsive React frontend
- MySQL database

## Deployment to Render

### Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Database**: Set up a MySQL database (recommended: PlanetScale, Railway, or AWS RDS)

### Database Setup

For production, you'll need an external MySQL database. Here are some free/paid options:

1. **PlanetScale** (Recommended - Free tier available)
   - Go to [planetscale.com](https://planetscale.com)
   - Create a database
   - Get your connection details

2. **Railway**
   - Go to [railway.app](https://railway.app)
   - Create a MySQL database
   - Get connection details

### Render Deployment Steps

1. **Connect Repository**
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: evangadi-forum (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: (leave empty)

3. **Environment Variables**
   Set these in Render's Environment section:

   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-jwt-secret-here
   FRONTEND_URL=https://your-app-name.onrender.com
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   PORT=10000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.onrender.com`

### Alternative: Using render.yaml

If you prefer using the render.yaml file:

1. Push the `render.yaml` file to your repository
2. In Render, select "Blueprint" instead of "Web Service"
3. Connect your repository
4. The configuration will be automatically applied

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file with local database credentials
4. Run development server: `npm run dev`
5. Build for production: `npm run build`
6. Start production server: `npm start`

## Project Structure

```
Evangadi-Forum/
├── client/          # React frontend
├── controller/      # API controllers
├── db/             # Database configuration and schemas
├── middleware/     # Authentication middleware
├── routes/         # API routes
├── app.js          # Main server file
└── package.json    # Dependencies and scripts
```

## API Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/check` - Check user authentication
- `POST /api/users/forget-password` - Password reset
- `GET /api/question` - Get questions
- `POST /api/question` - Create question
- `GET /api/answers` - Get answers
- `POST /api/answers` - Create answer

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Database**: MySQL
- **Authentication**: JWT
- **Styling**: CSS Modules
