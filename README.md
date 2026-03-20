For the project of Tech Web cours at University of Naples Federico II. MemeMuseum is a modern and secure SPA based on RESTfull architecture style.
MemeMuseum is a full-stack web application that allows users to browse, share, and interact with memes.  
Users can register, upload memes, vote, comment, and manage their profile.  
  
This project was developed as part of Tech Web cours at University of Naples Federico II and focuses on clean architecture, security, and modern web technologies.

---  
## 🚀 Features  
  
- 🔐 User authentication (JWT-based).
- 📸 Upload and manage memes.
- 👍 Upvote / 👎 Downvote system (toggle).
- 💬 Comment system with modal UI.
- 🖼️ Profile picture update.
- 🚫 Access control for unauthenticated users.
- 🔔 Toast notifications for user feedback.
- 🧪 End-to-End testing with Playwright.
  
---  
## 🧰 Tech Stack  

### Frontend  
- Angular
- Tailwind CSS + DaisyUI  
- TypeScript  
### Backend  
- Node.js  
- Express  
- Sequelize ORM  
- SQLite  
### Testing  
- Playwright (E2E testing)  
  
---  
## 🏗️ Architecture  
  
The project follows a separated frontend/backend architecture:

```

/backend  → Express API + database

/frontend → Angular application

```  

- REST API handles authentication, memes, votes, and comments
- Frontend communicates via HTTP requests
- JWT used for authentication
- Passwords hashed with bcrypt

---
## ⚙️ Installation
### 1. Clone the repository

```

git clone https://github.com/m3tt0/MemeMuseum.git

cd MemeMuseum

```

---
### 2. Configure environment variables ⚠️

Before running the backend, you must configure the environment variables.  
Inside the `backend` folder, copy the example file:

```
cp .env.example .env
```

Then edit the '.env ' file and provide the values of your choice:

```
DB_CONNECTION_URI="./data/mememuseum.sqlite"
DIALECT="sqlite"
TOKEN_SECRET="your_secret_here"
```

> ⚠️ The application will not work correctly without a properly configured `.env` file.  
  
---
### ▶️ Running the Project
#### Backend

```

cd backend

npm install

npm start

```

Server runs on:

```

http://localhost:3030

```


---
### Frontend

```

cd frontend

npm install

npm start

```

App runs on:

```

http://localhost:4200

```

---

## 🧪 Running Tests (Playwright)

### Run all tests

```

npx playwright test

```
### Run in UI mode

```

npx playwright test --ui

```
### Run only Chromium

```

npx playwright test --project=chromium

```
### Show report

```

npx playwright show-report

```

---
## 🧠 Future Improvements

- 🧪 Better test isolation (database seeding/reset)
- 📦 Docker support
- 🔍 Advanced search and filtering
- 👥 Social features (followers, profiles)
  
---
## 👤 Author

- GitHub: https://github.com/m3tt0

---
## 📄 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software, provided that the original copyright notice and license are included.

See the [LICENSE](./LICENSE) file for more details.