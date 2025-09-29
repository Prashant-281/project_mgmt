About
A full-stack project management tool built with Next.js + TypeScript (Frontend) and Express.js + MongoDB (Backend).
It allows users to perform full CRUD operations on both projects and tasks. Authenticated users can manage multiple projects, and each project can have its own set of tasks.

Prerequisites

    Node.js (LTS) - version v22.20.0

    MongoDB (Atlas or Local Server)

---------------------- 🚀 BACKEND ----------------------


⚙️ Tech Stack
       Express.js (with ES Modules)
       MongoDB & Mongoose
       JSON Web Tokens (JWT)
       Nodemon
       TypeScript 

- Installation prerequisites - MongoDB Atlas or MongoDb server

- Installation - cd into backend directory and run `npm install express` to install express js
               - database setup is included in .env file with values for DB_URI, JWT_SECRET , PORT
               - .env file is included in project for ease of setup 

- Run Scripts  -`npm run dev` (to run in development)
               - Server listens on `http://localhost:5500`

 Seeding Data -`npm run seed` to seed data in backend for testing
                Seeded user has `email - test@example.com` `password- Test@123` `name - Test User`
                
💡 Features
    ✅ Auth: 
        User registration & login using JWT
        Protected routes for all project & task actions

    📁 Projects:
        RESTful APIs for create / update / delete / view
        Associated with authenticated user

📌 Tasks:
        RESTful APIs for CRUD operations
        Associated with a specific project
        Supports pagination and query filtering

 
    API Query Parameters 
        Filter by 
                    Status:
                       ?status='todo'
                       ?status='in-progress'
                       ?status='completed'
                   Pagination:
                       ?page=1     



  ---------------------- 🌐 FRONTEND ----------------------


⚙️ Tech Stack
     Next.js
     TypeScript
     Axios
     JWT Authentication
     React Hook Form + Yup (for form validation)
    
📦 Installation - cd in frontend_next directory and run `npx create-next-app@latest my-next-app` to install latest next
                - Axios is required and already configured with a base URL in api.ts.
                -to install required node modules run `npm install`

- Run Scripts - `npm run dev` (to run in development)
                npm run build && npm run start to make a build and run 
                      then visit  `http://localhost:3000`

💡 Features 
            🔐 User Registration & Login (JWT-based authentication)
            📋 Dashboard to list all user-specific projects
            🧩 Full CRUD functionality on:
                Projects
                Tasks (associated with specific projects)
            ✅ Form validation using React Hook Form + Yup
            🔧 TypeScript-based development for type safety