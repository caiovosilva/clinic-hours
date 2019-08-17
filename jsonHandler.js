const fs = require('fs')
const moment = require('moment')

function saveRule(rule, res, callBack) {     
    const newRule = {}

    if(rule.specificDay) {
        newRule.type = 'specificDay'
        newRule.intervals = []
        if('day' in rule.specificDay) {
            const date = moment(rule.specificDay.day, 'DD-MM-YYYY')
            if(date.isValid()) newRule.day = date._i
        }
        if('intervals' in rule.specificDay && Array.isArray(rule.specificDay.intervals)) {
            for(let k in rule.specificDay.intervals) {   //MUDAR PRA ARRAY METHODS
                const element = rule.specificDay.intervals[k]
                const newInterval = {}
                if('start' in element) newInterval.start = element.start
                if('end' in element) newInterval.end = element.end
                if(newInterval.start && newInterval.end) 
                    newRule.intervals.push(newInterval)
                else 
                    callBack(res.status(400).send(`start or end not found`))

            }
        }
        if(!newRule.day || newRule.intervals.length<1)
            callBack(res.status(400).send(`Bad request - visit the home screen for the API reference`))
    }
    else 
    if(rule.daily) {
        newRule.type = 'daily'
        newRule.intervals = []
        if('intervals' in rule.daily && Array.isArray(rule.daily.intervals))
            for(let k in rule.daily.intervals) {  //MUDAR PRA ARRAY METHODS
                const element = rule.daily.intervals[k]
                const newInterval = {}
                if('start' in element) newInterval.start = element.start
                if('end' in element) newInterval.end = element.end
                if(newInterval.start && newInterval.end) 
                    newRule.intervals.push(newInterval)
                else 
                    callBack(res.status(400).send(`start or end not found`))
            }
        if(newRule.intervals.length<1)
            callBack(res.status(400).send(`Intervals array is empty`))
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
        callBack(res.status(400).send(`Rule for a specific day, daily or weekly not found`))

    fs.readFile('rules.json', 'utf8', readFileCallback)  

    function readFileCallback(err, data){
        if (err) callBack(err)

        const obj = JSON.parse(data); //now as an object
        const rules = obj.rules
        if(rules.length <1 ) newRule.id = 0
        else{
            newRule.id = rules[rules.length - 1].id + 1
        }
        rules.push(newRule) //add some data
        jsonRules = JSON.stringify(obj, null, 2); //convert it back to json
        fs.writeFile('./rules.json', jsonRules, 'utf8', (err) => {
            if (err) callBack(err)
            callBack(newRule)
        })
    }
}

function deleteRule(ruleId, res, callBack) {
    //look up the course
    //if not existing, return 404
    fs.readFile('rules.json', 'utf8', (err, data) => {
        if (err) callBack(err)
        const obj = JSON.parse(data);
        const oldRules = obj.rules
        ruleId = parseInt(ruleId) //would not need that if using typescript
        obj.rules = oldRules.filter((elem) => {
            console.log(elem.id)
            return elem.id !== ruleId
        })
        if(oldRules.length !== obj.rules.length) {
            jsonRules = JSON.stringify(obj, null, 2);
            fs.writeFile('./rules.json', jsonRules, 'utf8', (err) => {
                callBack(err || obj.rules)
            })
        }
        else callBack(res.status(404).send('the rule for the given ID was not found'))
    })
}

function listRules(callBack) {
    fs.readFile('rules.json', 'utf8', (err, data) => {
        if (err) callBack(err)
        const obj = JSON.parse(data);
        callBack(obj.rules)
    })
}

module.exports.saveRule = saveRule
module.exports.deleteRule = deleteRule
module.exports.listRules = listRules
