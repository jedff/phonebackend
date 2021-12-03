const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
pp.use(express.static('build'))
app.use(express.json())


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const totalPersons = persons.length
const date = new Date()

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}

app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${totalPersons} people <br/> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person ? response.json(person) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number missing'
    })
  }
  if(persons.find(n => n.name === body.name)) {
    return response.status(400).json({
      error: 'The name already exists in the phonebook'
    })
  }

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person.number = request.body.number
  response.json(person)
  response.status(204).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.status(201).json(person)
})

const PORT =  process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`Server runing on ${PORT}`)
})
