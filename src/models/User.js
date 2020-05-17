const mongoose = require('../dataBase/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticate = require('../configs/tokenConfig.json')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPassword: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }

})

userSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const userModel = mongoose.model('Users', userSchema)

const generateToken = (params = {}) => {
    return jwt.sign(params, authenticate.secret, {
        expiresIn: 86400,
    })
}

const User = {
    register: async (params) => {
        try{
            const { email, name, password } = params
            if(!!await userModel.findOne({ email: email })) return { error: 'Usuário já registrado.' }
            if(!name) return { error: 'Não foi informado o nome.' }
            if(!email) return { error: 'Não foi informado o email.' }
            if(!password) return { error: 'Não foi informado a senha.' }
            const newUser = await userModel.create(params)
            newUser.password = undefined
            const token = generateToken({id: newUser._id})
            return { newUser, token }
        } catch(err) {
            return { error: 'Não foi possível cadastrar o usuário. '+err }
        }
    },
    findAll: async () => {
        try {
            const allUsers = await userModel.find()
            if(!allUsers) return {error: 'Não há usuários registrados.'}
            return allUsers
        } catch (err) {
            return { error: 'Não foi possível buscar os usuários. '+err }
        }
    },
    delete: async (_id) => {
        try {
            if(!await userModel.findOne({ _id })) return { error: 'Usuário não existe ou já excluído.' }
            await userModel.findByIdAndDelete({ _id })
            return true
        } catch (err) {
            return { error: 'Não foi possível excluir o usuário. '+err }
        }
    },
    signIn: async (params) => {
        try {
            const { email, password, _id } = params
            const user = await userModel.findOne({email}).select('+password')
            if(!user) return { error: 'Usuário não encontrado. Certeza que tem cadastro?' }
            if(!await bcrypt.compare(password, user.password))
                return { error: 'Senha inválida, esqueceu sua senha?' }
            user.password = undefined
            const token = generateToken({id: _id})
            return { user, token }
        } catch (err) {
            return { error: 'Não foi possível fazer login. '+err }
        }
    },
}

module.exports = User