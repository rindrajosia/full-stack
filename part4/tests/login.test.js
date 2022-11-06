const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)


beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('Sekret1', 10)

  const user = new User({ username: 'rindra', name: 'josia', passwordHash })

  await user.save()

}, 500000)


describe('token based authentication', () => {

  test('authentication of existing user', async () => {
    const existingUser = {
      username: 'rindra',
      password: 'Sekret1'
    }


    const response = await api
      .post('/api/login')
      .send(existingUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()

    expect(response.body.username).toBe('rindra')
    expect(response.body.name).toBe('josia')

  }, 500000)

  test('authentication with wrong password', async () => {
    const wrongPassword = {
      username: 'rindra',
      password: 'Sekret1Wrong'
    }
    const response = await api
      .post('/api/login')
      .send(wrongPassword)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).not.toBeDefined()

    expect(response.body.error).toBe('invalid username or password')

  }, 500000)


  test('authentication with wrong username', async () => {
    const wrongusername = {
      username: 'wrongusername',
      password: 'Sekret1Wrong'
    }
    const response = await api
      .post('/api/login')
      .send(wrongusername)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid username or password')

  }, 500000)




})
