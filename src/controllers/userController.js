const express = require('express')

const router = express.Router()

const User = require('../models/User')

router.post('/register', async (req, res) => {
    try {
        const newUser = await User.register(req.body, res)
        if (newUser.error){
            return res.status(400).send({error: newUser.error})
        }
        return res.send({ newUser })
    } catch (err) {
        return res.status(400).send({'Erro: ': err })
    }
})

router.get('/all', async (req, res) => {
    try {
        const allUsers = await User.findAll()
        return res.send(allUsers)
    } catch (err) {
        return res.status(400).send(`Não foi possível encontrar os usuários: Erro: `+err)
    }
})

router.delete('/delete/:_id', async (req, res) => {
    try {
        const _id = req.params._id
        const isDeleted = await User.delete(_id)
        if(!!isDeleted.error) return res.status(400).send({error: isDeleted.error})
        return res.send({deleted: isDeleted})
    } catch (err) {
        return res.status(400).send({"Não foi possível deletar o usuário": err})
    }
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.signIn(req.body)
        if(user.error) return res.status(400).send({error: user.error})
        return res.send({user})
    } catch (err) {
        console.log(err)
    }
})

module.exports = App => App.use('/user', router)