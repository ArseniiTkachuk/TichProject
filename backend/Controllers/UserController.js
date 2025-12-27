import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'



export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        // Перевірка, чи існує користувач з таким email
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' })
        }


        // Генеруємо хеш пароля
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // Створюємо нового користувача
        const doc = new UserModel({
            name,
            email,
            passwordHash: hash,
        })

        const user = await doc.save()

        // Генеруємо токен
        const token = jwt.sign({ _id: user._id }, 'TOKEN', { expiresIn: '30d' })

        const { passwordHash, ...userData } = user._doc
        res.json({ token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Не вдалося зареєструватися' })
    }
}


export const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        // Перевірка, чи існує користувач з таким email
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Невірний логін або пароль'
            })
        }

        // Перевірка, чи вірний password
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Невірний логін або пароль'
            })
        }


        // Генеруємо токен
        const token = jwt.sign({
            _id: user._id
        }, 'TOKEN', {
            expiresIn: '30d'
        })

        const { passwordHash, ...userData } = user._doc

        res.json({
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не вдалося ввійти'
        })
    }
}

export const userProfile = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.userId })
        if (!user) {
            return res.status(404).json({
                message: 'Користувач не існує'
            })
        }

        

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Помилка сервера'
        })
    }
}