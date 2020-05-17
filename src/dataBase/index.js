const mongoose = require('mongoose')
const databaseName = 'CRUD-users'
mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() =>{
    console.log(`Conectado com sucesso ao banco de dados: ${databaseName}`)
})

module.exports = mongoose