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

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Agenda.findById(id)
    .then(people => {
      if (people) {
        res.status(200).json(people)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => {
      res.status(400).send({ error: 'malformated id' })
    })
})

app.post('/api/persons/', (req, res) => {
  const name = req.body.name
  const number = req.body.number
  if (!name || !number) {
    return res.status(402).json({ error: 'Falta el nombre o el número en el body' })
  }

  const newPerson = new Agenda({
    name,
    number
  })

  newPerson.save()
    .then(savePerson => {
      res.status(201).json(savePerson)
    })
    .catch(e => {
      res.status(400).json({ error: 'error al guardar la nueva Persona' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Agenda.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        res.status(200).json(result)
      } else {
        res.status(404).json({ error: 'No existe la Persona a borra' })
      }
    })
    .catch(e => {
      res.status(400).send({ error: 'malformated id' })
    })
})

app.get('/info', (req, res) => {
  const fecha = new Date()
  Agenda.find({})
    .then((agenda) => {
      console.log(agenda.length)
      const info = `Phonebook has info for ${agenda.length} people \n ${fecha.toString()}`
      res.send(info)
    })
    .catch((e) => {
      res.send(400).end()
    })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
