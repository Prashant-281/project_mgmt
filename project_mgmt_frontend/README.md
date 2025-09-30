##  ---------------------- 🌐 FRONTEND ----------------------


* ⚙️ Tech Stack
  
     * Next.js
     * TypeScript
     * Axios
     * JWT Authentication
     * React Hook Form + Yup (for form validation)
    
📦 Installation - cd in project_mgmt_frontend directory and run `npm install` to install node modules and dependencies
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
    
## API Collection for API Testing

An HTTP request collection for API testing has been added in the root folder of this project. It contains pre-configured API requests that can be used for testing and interacting with the backend.

### Location:
The API collection file is located in the root folder as **httpie-collections-project_mgmt_backend.json**.

### How to Use:

#### Import to HTTPie Desktop/Web:
1. Open **HTTPie Desktop/Web**.
2. Look for the **Import** feature in the app’s menu.
3. Import the `httpie-collections-project_mgmt_backend.json` from the root folder of the project.
4. You can now easily run the configured requests within HTTPie.

### Notes:
- The collection contains endpoints for **user authentication**, **project management**, and **task management**.
- You will need to provide appropriate **authentication tokens** for requests that require authorization.
