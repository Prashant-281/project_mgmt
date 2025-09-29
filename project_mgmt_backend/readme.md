## ---------------------- 🚀 BACKEND ----------------------


* ⚙️ Tech Stack

   * Express.js (with ES Modules)
   * MongoDB & Mongoose
   * JSON Web Tokens (JWT)
   * Nodemon
   * TypeScript
  

- Installation prerequisites - MongoDB Atlas or MongoDb server

- Installation - cd into project_mgmt_backend directory and run `npm install` to install node modules and dependencies
               - database setup is included in .env file with values for DB_URI, JWT_SECRET , PORT
               - .env file is included in project for ease of setup 

- Run Scripts  -`npm run dev` (to run in development)
               - Server listens on `http://localhost:5500`

 ### Seeding Data
 -`npm run seed` to seed data in backend 
                For testing
                Seeded user has `email - test@example.com` `password- Test@123` `name - Test User`
                
#### 💡 Project Features
    ✅ Auth: 
        * User registration & login using JWT
        * Protected routes for all project & task actions

     📁 Projects:
        * RESTful APIs for create / update / delete / view
        * Associated with authenticated user
  
     📌 Tasks:
        * RESTful APIs for CRUD operations
        * Associated with a specific project
        * Supports pagination and query filtering

 
 ####  Additional API features
    API Query Parameters 
        Filter by 
              * Status:
                       ?status='todo'
                       ?status='in-progress'
                       ?status='completed'
                       
              * Pagination:
                       ?page=1     
