const express = require('express')
const BodyParser = require('body-parser')

const App = express()

App.use('/', (req, res) => {
    return res.send({ "Hello": "Welcome" })
})


App.listen(3001, () => {
    console.log('User server running at port: 3001.')
})