const { isNameNotEmpty, isNameUnique } = require('./utils/modules');
require('dotenv').config();
const Phone = require('./models/phone');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(cors());

app.use(express.json());

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
})



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data',{
  skip: (req, res) => { return req.method !== "POST" }
}));

app.use(express.static('build'));



app.get('/api/persons', (req, res, next) => {

    Phone
      .find({})
      .then(personnes => {
        res.json(personnes);
      })
      .catch(error => {
        next(error);
      });
})

app.get('/api/info', (req, res) => {

  Phone
    .find({})
    .then(personnes => {
      res.send(`Phonebook has info for ${personnes.length} <br/> ${new Date()}`);
    })
    .catch(error => {
      next(error);
    });
})

app.get('/api/persons/:id', (req, res, next) => {

    Phone.findById(req.params.id)
      .then(personne => {
        if(!personne) {
          return res.status(404).end();
        } else {
          res.json(personne);
        }
      })
      .catch(error => {
        next(error);
      })
})

app.delete('/api/persons/:id', (req, res, next) => {

    Phone.findByIdAndRemove(req.params.id)
      .then(result => {
        console.log(result)
        if(result) {
          res.status(204).end();
        } else {
          return res.status(404).end();
        }
      })
      .catch(error => {
        next(error);
      })


})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;


    const personne = new Phone({
      name: body.name,
      number: body.number || "not defined",
    })

    console.log(personne);

    personne.save()
      .then(savedPhone => {
        res.json(personne);
      })
      .catch(error => {
        next(error)
      });
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number || "not defined",
  }

  Phone
    .findByIdAndUpdate(
      req.params.id,
      person,
      {new: true, runValidators: true, context: 'query' }
    )
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))

})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {

  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if(error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  return next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log(`Server running on port ${3001}`);
