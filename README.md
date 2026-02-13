# 🛋 Luxury Furniture Website Setup Guide

Follow these steps to get your professional furniture showroom website up and running.

## 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for database)
- [Cloudinary](https://cloudinary.com/) account (for images)

## 2. Backend Setup
1. Open a terminal in the `backend` folder.
2. Copy the `.env.example` file to a new file named `.env`.
3. Fill in your credentials in the `.env` file:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A random long string for security.
   - `CLOUDINARY_CLOUD_NAME`: From your Cloudinary dashboard.
   - `CLOUDINARY_API_KEY`: From your Cloudinary dashboard.
   - `CLOUDINARY_API_SECRET`: From your Cloudinary dashboard.
4. Run:
   ```bash
   npm install
   npm run dev (or nodemon server.js)
   ```

## 3. Frontend Setup
1. Open a terminal in the `frontend` folder.
2. Create a `.env` file (optional, defaults to localhost:5000):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run:
   ```bash
   npm install
   npm run dev
   ```

## 4. Administrative First Steps
1. **Access Admin Panel**: Go to `http://localhost:5173/admin/login`.
2. **First Admin**: Run the following command in the `backend` folder to create your first admin account (`admin@furniture.com` / `admin123`):
   ```bash
   node adminSetup.js
   ```
3. **Site Settings**: Once logged in, go to **Site Settings** to upload your logo and set your WhatsApp number.
4. **Add Products**: Go to **Products** to start building your gallery.

## 🚀 WhatsApp Integration
The website is pre-configured to generate dynamic messages. Ensure your WhatsApp number in Settings includes the country code (e.g., `919876543210`).
