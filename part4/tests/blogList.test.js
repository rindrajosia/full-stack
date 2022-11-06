const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)

  const passwordHash = await bcrypt.hash('Sekret1', 10)

  const user = new User({ username: 'rindra', name: 'josia', passwordHash })

  await user.save()
})




describe('when there is initially some blogs saved', () => {
  test('Blog lists are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  }, 500000)


  test('The blog lists return the correct amount of data', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })


  test('a specific blog is within the returned Blog lists', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      'React patterns'
    )
  })



  test('Verify that the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')


    expect(response.body[0].id).toBeDefined()
  })




})





describe('addition of a new blog', () => {
  test('Blog is added', async () => {

    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'React patterns'
    )
  })


  test('Blog is not added if token is missing', async () => {

    const newBlog = {
      title: 'Loren ipsum',
      author: 'Pink',
      url: 'http://blog.pink.com',
      likes: 2,
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)


    expect(response.body.error).toBe('token missing or invalid')
  })


  test('If the likes property is missing from the request, it will default to the value 0', async () => {
    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    await Blog.deleteMany({})
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)

    const response = await api.get('/api/blogs')


    expect(response.body[0].likes).toBe(0)
  })



  test('If the title properties are missing from the request data, it responds with the status code 400 Bad Request', async () => {

    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('If the URL properties are missing from the request data, it responds with the status code 400 Bad Request', async () => {

    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    const newBlog = {
      author: 'Robert C. Martin',
      title: 'Go To Statement Considered Harmful',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })



})









describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {

    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]



    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })


  test('Fails with status code 401 if Token is missing', async () => {

    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)


    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]


    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.error).toBe('token missing or invalid')

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain(blogToDelete.title)

  })




  test('fails with status code 400 if id is not a valid format', async () => {
    const token = await api
      .post('/api/login')
      .send(helper.existingUser)

    await api
      .delete('/api/blogs/idnotavalidfomrat')
      .set('Authorization', `bearer ${token.body.token}`)
      .expect(400)
  })


})







describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]


    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })


})







describe('update blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToUpdate = blogsAtStart[0]

    const expectReturnedUpdate = {
      ...blogToUpdate,
      likes: 100
    }

    const newLike = {
      likes: 100,
    }

    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLike)
      .expect(200)
      .expect('Content-Type', /application\/json/)



    expect(resultBlog.body).toEqual(expectReturnedUpdate)



    const blogsAtEnd = await helper.blogsInDb()

    const likes = blogsAtEnd.map(n => n.likes)
    expect(likes[0]).toEqual(100)
  })



  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 100
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })



})





afterAll(() => {
  mongoose.connection.close()
})
