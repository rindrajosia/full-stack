const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})

    const response = await blogs

    res.json(blogs)
  } catch (exeption){
    next(exeption)
  }



})

blogsRouter.post('/', async (req, res, next) => {

  const blog = new Blog({
    ...req.body,
    likes: req.body.likes || 0
  })

  try {

    const result = await blog.save()

    res.status(201).json(result)
  } catch (exeption){
    next(exeption)
  }

})


module.exports = blogsRouter
