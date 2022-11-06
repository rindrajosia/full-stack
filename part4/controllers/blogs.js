const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

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




blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {



  try {

    const user = req.user


    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0,
      user
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    res.status(201).json(savedBlog)
  } catch (exeption){
    next(exeption)
  }

})


blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {


  try {
    const blog = await Blog.findById(req.params.id)

    const user = req.user

    if (!user.id || blog.user.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const result = await blog.deleteOne({ _id: req.params.id })

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
