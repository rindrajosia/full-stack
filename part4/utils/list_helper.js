const dummy = (blogs) => { // eslint-disable-line no-unused-vars
  return 1
}

const totalLikes = (listBlogs) => {

  const total = listBlogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return total
}

const favoriteBlog = (listBlogs) => {

  if(listBlogs.length === 0) {
    return {}
  }

  const favorite = listBlogs.reduce((p, v) => {
    return ( p.likes > v.likes ? p : v )
  })



  const returnedFavorite = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }

  return returnedFavorite
}



const mostBlogs = (listBlogs) => {
  const most = {}

  if(listBlogs.length === 0) {
    return {}
  }



  listBlogs.forEach((blog, i) => {// eslint-disable-line no-unused-vars
    if(blog.author in most) {

      most[blog.author] += 1
    } else{
      most[blog.author] = 1
    }
  })

  const values = Object.values(most)
  const keys = Object.keys(most)
  const maxBlogs = Math.max(...values)


  const returnedAuthor = keys.find(key => {
    return (most[key] === maxBlogs)
  })



  return {
    author: returnedAuthor,
    blogs: most[returnedAuthor]
  }
}




const mostLikes = (listBlogs) => {
  const most = {}

  if(listBlogs.length === 0) {
    return {}
  }



  listBlogs.forEach((blog, i) => {// eslint-disable-line no-unused-vars
    if(blog.author in most) {

      most[blog.author] += blog.likes
    } else{
      most[blog.author] = blog.likes
    }
  })

  const values = Object.values(most)
  const keys = Object.keys(most)
  const maxLikes = Math.max(...values)


  const returnedAuthor = keys.find(key => {
    return (most[key] === maxLikes)
  })



  return {
    author: returnedAuthor,
    likes: most[returnedAuthor]
  }
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
