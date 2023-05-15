require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Agenda = require('./models/agenda')

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :req[content-length] :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Agenda.find({}).then(agenda => res.json(agenda))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Agenda.findById(id)
    .then(people => {
      if (people) {
        res.status(200).json(people)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => next(e))
})

app.post('/api/persons/', (req, res, next) => {
  const name = req.body.name
  const number = req.body.number

  console.log(typeof (number))

  const newPerson = new Agenda({
    name,
    number
  })

  newPerson.save()
    .then(savePerson => {
      res.status(201).json(savePerson)
    })
    .catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Agenda.findByIdAndDelete(id)
    .then(person => {
      if (person) {
        res.status(200).json(person)
      } else {
        res.status(404).json({ error: 'No existe la Persona a borra' })
      }
    })
    .catch(e => {
      res.status(400).send({ error: 'malformated id' })
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const update = {
    name: req.body.name,
    number: req.body.number
  }
  Agenda.findByIdAndUpdate(id, update, { new: true })
    .then((person) => {
      res.status(200).json(person)
    })
    .catch((e) => next(e))
})

app.get('/info', (req, res) => {
  const fecha = new Date()
  Agenda.find({})
    .then((agenda) => {
      const info = `Phonebook has info for ${agenda.length} people \n ${fecha.toString()}`
      res.send(info)
    })
    .catch((e) => {
      res.send(400).end()
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
