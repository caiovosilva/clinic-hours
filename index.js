const Joi = require('joi')
const express = require('express')
const app = express();

app.use(express.json());

const rules = [
    {
        specificDay: [
            {
                day: "25-01-2018",
                intervals: [{ start: "14:30", end: "15:00" }, { start: "15:10", end: "15:30" }]
            },
            {
                day: "26-01-2018",
                intervals: [{ start: "14:30", end: "15:00" }, { start: "15:00", end: "15:30" }]
            }
        ]
    },
    {
        daily: [
            {
                intervals: [{ start: "9:30", end: "10:00" }, { start: "19:10", end: "20:30" }]
            },
            {
                intervals: [{ start: "4:30", end: "5:00" }, { start: "5:20", end: "5:30" }]
            }
        ]
    },
    {
        weekly: [
            {
                day: 0,
                start: "9:30", 
                end: "10:00"
            },
            {
                day: 3,
                start: "9:30", 
                end: "10:00"
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

app.get('/api/rules', (req,res) => {
    res.send(rules)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')

    res.send(course)
})

function postRule(rule, res) {     
    const moment = require('moment')
    const newRule = {}

    if(rule.specificDay) {
        newRule.type = 'specificDay'
        newRule.intervals = []
        if('day' in rule.specificDay) {
            const date = moment(rule.specificDay.day, 'DD-MM-YYYY')
            if(date.isValid()) newRule.day = date._i
        }
        if('intervals' in rule.specificDay && Array.isArray(rule.specificDay.intervals))
            for(let k in rule.specificDay.intervals) {
                const element = rule.specificDay.intervals[k]
                const newInterval = {}
                if('start' in element) newInterval.start = element.start
                if('end' in element) newInterval.end = element.end
                if(newInterval.start && newInterval.end) newRule.intervals.push(newInterval)
            }
        if(!newRule.day || newRule.intervals.length<1)
            return res.status(400).send(`Bad request - visit the home screen for the API reference`)
    }
    else 
    if(rule.daily) {
        newRule.type = 'daily'
        newRule.intervals = []
        if('intervals' in rule.daily && Array.isArray(rule.daily.intervals))
            for(let k in rule.daily.intervals) {
                const element = rule.daily.intervals[k]
                const newInterval = {}
                if('start' in element) newInterval.start = element.start
                if('end' in element) newInterval.end = element.end
                if(newInterval.start && newInterval.end) newRule.intervals.push(newInterval)
            }
        if(newRule.intervals.length<1)
            return res.status(400).send(`Bad request - visit the home screen for the API reference`)
    }
    else 
    if(rule.weekly) {
        const element = rule.weekly
        newRule.type = 'weekly'
        if('day' in element) newRule.day = parseInt(element.day)
        if('start' in element) newRule.start = element.start
        if('end' in element) newRule.end = element.end
    }
    else
        return res.status(400).send(`Rule for a specific day, daily or weekly not found`)
    return newRule
}

app.post('/api/rules', (req,res) => {
    res.send(postRule(req.body, res))
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
// var moment = require('moment');
// var date = moment('20-04-2012', 'DD-MM-YYYY');
// console.log(date)