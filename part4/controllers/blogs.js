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



blogsRouter.get('/:id', async (req, res, next) => {

  try {

    const result = await Blog.findById(req.params.id)

    if(result) {
      res.json(result)
    } else {
      return res.status(404).end()
    }

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


blogsRouter.delete('/:id', async (req, res, next) => {

  try {

    const result = await Blog.findByIdAndRemove(req.params.id)

    if(result) {
      res.status(204).end()
    } else {
      return res.status(404).end()
    }

  } catch (exeption){
    next(exeption)
  }

})


blogsRouter.put('/:id', async (req, res, next) => {

  const blog = {
    likes: req.body.likes
  }

  try {

    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )

    if(result) {
      res.json(result)
    } else {
      return res.status(404).end()
    }




  } catch (exeption){
    next(exeption)
  }

})


module.exports = blogsRouter
