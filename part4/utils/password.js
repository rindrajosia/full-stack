const checkPassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  //const hasNonalphas = /\W/.test(password)

  if(hasUpperCase + hasLowerCase + hasNumbers < 3) {
    return false
  }
  return true
}

module.exports = checkPassword
