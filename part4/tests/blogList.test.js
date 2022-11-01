const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})




describe('when there is initially some notes saved', () => {
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





describe('addition of a new note', () => {
  test('Blog is added', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'React patterns'
    )
  })


  test('If the likes property is missing from the request, it will default to the value 0', async () => {
    await Blog.deleteMany({})
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')


    expect(response.body[0].likes).toBe(0)
  })



  test('If the title properties are missing from the request data, it responds with the status code 400 Bad Request', async () => {

    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('If the URL properties are missing from the request data, it responds with the status code 400 Bad Request', async () => {

    const newBlog = {
      author: 'Robert C. Martin',
      title: 'Go To Statement Considered Harmful',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

})









describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })


  test('fails with status code 400 if id is not a valid format', async () => {

    await api
      .delete('/api/blogs/idnotavalidfomrat')
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

  })



})



afterAll(() => {
  mongoose.connection.close()
})
