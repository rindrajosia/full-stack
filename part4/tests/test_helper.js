const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)


const initalUsers = [
  { username: 'rindra', name: 'josia', passwordHash:'Sekret1' }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
]


const existingUser = {
  username: 'rindra',
  password: 'Sekret1'
}




const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'test', url: 'https://reactplessons.com/', likes: 7 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const token = async () => {
  const response = await api
    .post('/api/login')
    .send(existingUser)

  return response.body.token
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initalUsers,
  usersInDb,
  existingUser,
  token
}
