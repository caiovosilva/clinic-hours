const fs = require('fs')

function saveRule(rule, res, callBack) {     
    const moment = require('moment')
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

    fs.readFile('rules.json', 'utf8', readFileCallback);    

    function readFileCallback(err, data){
        if (err) res.send(`Internal error`)

        obj = JSON.parse(data); //now it an object
        const rules = obj.rules
        if(rules.length <1 ) newRule.id = 0
        else{
            newRule.id = rules[rules.length - 1].id + 1
        }
        rules.push(newRule) //add some data
        jsonRules = JSON.stringify(obj, null, 2); //convert it back to json
        fs.writeFile('./rules.json', jsonRules, 'utf8', (err) => {
            if (err) res.send(`Internal error`)
            callBack(newRule)
        });
    }
    //return newRule
}

module.exports.saveRule = saveRule