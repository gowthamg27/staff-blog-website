✅ frontend/.env
REACT_APP_BACKEND_URL=https://your-backend-url.com
🔁 Replace https://your-backend-url.com with the actual hosted backend API URL, or http://localhost:5000 for local development.

✅ backend/.env
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
🔁 Replace your-mongodb-atlas-connection-string with your real MongoDB Atlas URI.

                             (or)

## 🔐 Environment Variables (.env Setup)

Before running the project, make sure to create the `.env` files as shown below in both the `frontend` and `backend` directories.

### 👉 Frontend `.env`

Create a `.env` file inside the `frontend/` folder with the following content:

REACT_APP_BACKEND_URL=https://your-backend-url.com

- Replace the URL with your backend API URL.
- If working locally, use: `http://localhost:5000`

### 👉 Backend `.env`

Create a `.env` file inside the `backend/` folder with the following content:

PORT=5000 MONGO_URI=your-mongodb-atlas-connection-string
- Replace with your actual MongoDB Atlas URI.

### ⚠️ Note
- Do NOT commit your `.env` files to GitHub.
- Ensure `.env` is added in your `.gitignore` file.
