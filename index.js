const Joi = require('joi')
const express = require('express')
const app = express();

app.use(express.json());

const rules = [
    {specificDay: [
            {
            day: "25-01-2018",
            intervals: [{ start: "14:30", end: "15:00" }, { start: "15:10", end: "15:30" }]
            },
            {
            day: "26-01-2018",
            intervals: [{ start: "14:30", end: "15:00" }, { start: "15:00", end: "15:30" }]
            },
            {
            day: "29-01-2018",
            intervals: [{ start: "10:40", end: "11:00" }, { start: "15:00", end: "15:30" }]
            }
        ]
    }

]
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

function validateRule(rule) {
    
    // const ruleSchema = {
    //     name: Joi.string().min(3).required()
    // }
    // return Joi.validate(course, courseSchema)
}


app.get('/', (req, res) => {
    //put the documentation here afterwards
    res.send(rules)
})

app.get('/api/courses', (req,res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')

    res.send(course)
})

app.post('/api/rules', (req,res) => {
    let rule = req.body
    if(!rule.specificDay && !rule.daily && !rule.wekly)
        return res.status(400).send(`choose if it's a rule for a specific day, daily or weekly`)
    const moment = require('moment')
    let newRule

    if(rule.specificDay) {
            if('day' in rule.specificDay)
                let day = moment(rule.specificDay.day, 'DD-MM-YYYY')
            if('intervals' in rule.specificDay && Array.isArray(intervals))
                fazer um for aqui 
        }
    //const result = validateRule(req.body)
    // if(result.error)
    //     return res.status(400).send(result.error.details[0].message)

    // const course = {
    //     id: courses.length + 1,
    //     name: req.body.name
    // }
    // courses.push(course)
    // res.send(course)
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

app.delete('/api/courses', (req,res) => {
    //look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')
    //delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    res.send(courses)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
var moment = require('moment');
var date = moment('20-04-2012', 'DD-MM-YYYY');
console.log(date)