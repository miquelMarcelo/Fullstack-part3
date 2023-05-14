const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :req[content-length] :response-time ms :body'))

let agenda = [
  {
    id: 1,
    name: 'Miquel',
    number: '3333'
  },
  {
    id: 2,
    name: 'Marta',
    number: '4444'
  },
  {
    id: 3,
    name: 'Juan',
    number: '5555'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(agenda)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const people = agenda.find(people => people.id === id)

  if (people) {
    return res.status(200).json(people)
  }
  res.status(404).end()
})

app.post('/api/persons/', (req, res) => {
  const error = {
    message: '',
    error: false
  }
  console.log(req.body)
  const name = req.body.name
  const number = req.body.number
  if (!name || !number) {
    error.message = 'Falta el nombre o el número en el body'
    error.error = true
  } else if (agenda.find(people => people.name === name)) {
    error.message = 'El nombre ya existe'
    error.error = true
  }
  if (error.error) {
    return res.status(402).json({ error: error.message })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name,
    number
  }
  agenda = agenda.concat(newPerson)
  res.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const newAgenda = agenda.filter(people => people.id !== id)

  if (newAgenda.length < agenda.length) {
    agenda = newAgenda
    return res.status(200).json(agenda)
  }
  res.status(404).end()
})

app.get('/info', (req, res) => {
  const fecha = new Date()
  const info = `Phonebook has info for ${agenda.length} people \n ${fecha.toString()}`
  res.send(info)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
