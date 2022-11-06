const usersRouter = require('express').Router()
const User = require('../models/user')
const checkPassword = require('../utils/password')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })

    res.json(users)

  } catch (error) {
    next(error)
  }


})

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  const saltHash = 10
  try {

    const existUser = await User.findOne({ username })

    if(existUser) {
      return res.status(400).json({
        error: 'username must be unique'
      })
    }

    if(password.length < 3 || !password ) {
      return res.status(400).json({
        error: 'password must be more than 3 Characters'
      })
    }

    if(!checkPassword(password) ) {
      return res.status(400).json({
        error: 'password must contain at least 1 UpperCase, 1 LowerCase and 1 Number'
      })
    }

    const passwordHash = await bcrypt.hash(password, saltHash)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)


  }catch (error) {
    next(error)
  }
})

module.exports = usersRouter
