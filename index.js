require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.get('/info', (request, response) => {
  Person.countDocuments().then((count_documents) => {
    response.send(`Phonebook has info for ${count_documents} people <br/> ${new Date()}`)})
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(addedPerson => {
    response.status(201).json(addedPerson)
    console.log(`Added ${body.name} number ${body.number} to Phonebook.`)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new : true, runValidators: true })
    .then(result => {
      response.status(404).json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })
  else if(error.name === 'ValidationError')
    return response.status(400).send({ error: error.message })
  next(error)
}

app.use(errorHandler)

const PORT =  process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`Server runing on ${PORT}`)
})
