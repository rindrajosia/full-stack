const { isNameNotEmpty, isNameUnique } = require('./utils/modules');
let { personnes } = require('./db');
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



app.get('/api/persons', (req, res) => {
    res.json(personnes);
})

app.get('/api/info', (req, res) => {
    const number = personnes.length;
    res.send(`Phonebook has info for ${number} <br/> ${new Date()}`);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const personne = personnes.find(n => n.id === id);

    if(!personne) {
      return res.status(404).json({
        error: 'Personne not found'
      })
    }

    res.json(personne);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    personnes = personnes.filter(n => n.id !== id);

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body;


    if(!body) {
      return res.status(400).json({
        error: 'content missing'
      })
    }

    if(!isNameNotEmpty(body.name)) {
      return res.status(400).json({
        error: 'Name missing'
      })
    }

    if(!isNameUnique(body.name, personnes)) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }


    const personne = {
      id: Math.floor(Math.random() * 1000),
      name: body.name,
      number: body.number || "not defined",
    }
    personnes = personnes.concat(personne);

    res.json(personne);
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log(`Server running on port ${3001}`);
