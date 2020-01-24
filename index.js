const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

/* .env */
const SECRET_KEY = '123456789'
const expiresIn = '1h'

const server = jsonServer.create()
const router = jsonServer.router('./src/json/db.json')

const userdb = JSON.parse(fs.readFileSync('./src/json/users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

/* Create a token from a payload */
createToken = (payload) => (
    jwt.sign(payload, SECRET_KEY, {expiresIn})
)
  
/* Verify the token */
verifyToken = (token) => (
  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
)

/* Check if the user exists in database */
findUser = ({email, password}) => {
    const userJson = userdb.users
    const indexUser = userJson.findIndex(user => {
      return user.email === email && user.password === password !== -1
    })

    return userJson[indexUser]
}

/* Auth */
server.post('/auth/login', (req, res) => {
    const {email, password} = req.body

    const user = findUser({email, password})

    if (user === undefined) {
      const status = 401
      const message = 'Incorrect email or password'
      return res.status(status).json({status, message})
    }
   
    const token = createToken({email, password})
    
    return res.status(200).json({token, user})
})

/* Middleware JWT */
server.use(/^(?!\/auth).*$/,  (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      const status = 401
      const message = 'Bad authorization header'
      res.status(status).json({status, message})
      return
    }
    try {
       verifyToken(req.headers.authorization.split(' ')[1])
       next()
    } catch (err) {
      const status = 401
      const message = 'Error: access token is not valid'
      res.status(status).json({status, message})
    }
  })

server.use(router)

server.listen(3000, () => {
  console.log('Run Ecobrisa API Json Server')
})