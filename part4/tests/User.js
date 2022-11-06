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



describe('when there is initially some users saved', () => {
  test('users lists are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  }, 500000)


  test('The User lists return the correct amount of data', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(1)
  })


})




describe('To create User', () => {


  test('Create user with valid password and username', async () => {

    const user = { username: 'marina', name: 'marina', password: 'Sekret2' }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toEqual('marina')

  })

  test('Create user with invalid password not follow the rule: password must contain at least 1 UpperCase, 1 LowerCase and 1 Number', async () => {
    const response = await api.get('/api/users')

    const user = { username: 'feno', name: 'feno', password: 'Sekret' }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must contain at least 1 UpperCase, 1 LowerCase and 1 Number')
    expect(response.body).toHaveLength(1)

  })

  test('Create user with invalid password not follow the rule: at least 3 characters', async () => {
    const response = await api.get('/api/users')

    const user = { username: 'feno', name: 'feno', password: 'Se' }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be more than 3 Characters')
    expect(response.body).toHaveLength(1)

  })

  test('Create user with invalid password not follow the rule: at least 3 characters', async () => {
    const response = await api.get('/api/users')

    const user = { username: 'feno', name: 'feno', password: 'Se' }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be more than 3 Characters')
    expect(response.body).toHaveLength(1)

  })

  test('Create user with duplicated username', async () => {
    const response = await api.get('/api/users')

    const user = { username: 'rindra', name: 'feno', password: 'Sekret2' }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')
    expect(response.body).toHaveLength(1)

  })
})
