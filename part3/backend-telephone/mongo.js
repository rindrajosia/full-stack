const mongoose = require('mongoose')

if(process.argv.length > 5 || process.argv.length === 4) {
  console.log('Please provide 3 arguments : node mongo.js <password> <name> <number> . If the name contains whitespace characters, it must be enclosed in quotes')
  process.exit(1)
} else if (process.argv.length < 3){
  console.log('Please provide at least 1 argument the password: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.jlrjuxq.mongodb.net/phoneApp?retryWrites=true&w=majority`

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if(process.argv.length === 5) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log(result)
      const phone = new Phone({
        name,
        number,
      })

      return phone.save()
    })
    .then( result => {
      console.log(result)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {

  mongoose
    .connect(url)
    .then((result) => {
      console.log(result)
      return Phone.find({})
    })
    .then(result => {
      result.forEach(phone => {
        console.log(phone)
      })
      mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
