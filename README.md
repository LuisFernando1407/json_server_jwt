# Project execution

- Execute at the root of the project <b> npm install </b> or <b> yarn install </b>
- To start the API with JSON-SERVER and JWT run <b> npm run-script start-auth </b> or <b> yarn start-auth </b> in root of the project

### Authentication
- Route /POST http://localhost:3000/auth/login
<pre> 
{ 
   "email": "example@email.com", 
   "password:" "123456" 
} 
</pre>
 - To view registered users access: <b> src/json/users.json</b>
