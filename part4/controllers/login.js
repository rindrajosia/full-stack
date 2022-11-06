const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body

  try {

    const user = await User.findOne({ username })

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60*60 })

    res
      .status(200)
      .send({ token, username: user.username, name: user.name })

  } catch(error) {
    next(error)
  }
})


module.exports = loginRouter
