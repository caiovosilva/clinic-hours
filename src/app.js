const express = require('express')
const app = express()
const jsonHandler = require('./jsonHandler')
const fs = require('fs')


app.use(express.json());

//return all rules stored
app.get('/rules', (req,res) => {
    jsonHandler.listRules((returnedValue =>
        res.send(returnedValue)
    ))
})

//save new rule
//return the saved rule
app.post('/rules', (req,res) => {
    jsonHandler.saveRule(req.body, res, (returnedValue =>
        res.send(returnedValue)
    ))
})

//delete rule
//return the remaining rules
app.delete('/rules/:id', (req,res) => {
    jsonHandler.deleteRule(req.params.id, res, (returnedValue =>
        res.send(returnedValue)
    ))
})

//return all rules stored
app.get('/workinghours/:startDate/:endDate', (req,res) => {
    const moment = require('moment')

    jsonHandler.listRules((returnedValue) => {
        const businessLogic = require('./businessLogic')
        const startDate = moment(req.params.startDate, 'DD-MM-YYYY')
        const endDate = moment(req.params.endDate, 'DD-MM-YYYY')
        if(!startDate.isValid() || !endDate.isValid() || startDate.isAfter(endDate))
            res.status(400).send(`Invalid dates found`)
        businessLogic.getWorkingHours(startDate, endDate, returnedValue, (result =>
            res.send(result)
        ))     
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

module.exports = app;