const express = require('express')
const bodyParser = require('body-parser')
require('./dataBase/index')

const App = express()

App.use(bodyParser.json());
App.use(bodyParser.urlencoded( { extended: false } ));

require('./controllers/userController.js')(App)


App.get('/', (req, res) => {
    return res.send({ "Hello": "Welcome" })
})


const port = 3001
App.listen(port, () => {
    console.log(`Server de usuário iniciado. http://localhost:${port}`)
})