const Joi = require('joi')
const express = require('express')
const app = express()
const jsonHandler = require('./jsonHandler')
const fs = require('fs')


app.use(express.json());

app.get('/', (req, res) => {
    //put the documentation here afterwards
    res.send(rules)
})

app.get('/api/rules', (req,res) => {
    res.send(rules)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')

    res.send(course)
})

app.post('/api/rules', (req,res) => {
    jsonHandler.saveRule(req.body, res, (returnedValue) => {
        res.send(returnedValue)
    })
})

app.put('/api/courses/:id', (req,res) => {
    //look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')
    //Validate
    //if invalid, return 400 - bad request
    const { error } = validateCourse(req.body)

    if(error)
        return res.status(400).send(error.details[0].message)
    //update course
    //return the updated course
    course.name = req.body.name
    res.send(course)
})

app.delete('/api/rules/:id', (req,res) => {
    jsonHandler.deleteRule(req.params.id, res, (returnedValue) => {
        res.send(returnedValue)
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))