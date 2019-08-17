const moment = require('moment')

function getWorkingHours(startDate, endDate, rules, callBack) {
    const response = []
    const specificDayRules = rules.filter(x =>
        x.type === `specificDay` &&
        moment(x.day, 'DD-MM-YYYY').isSameOrAfter(startDate , 'day') &&
        endDate.isSameOrAfter(moment(x.day, 'DD-MM-YYYY'), 'day'))
    if(specificDayRules.length > 0) 
        formatSpecificDaysResponse(specificDayRules, response)

    const dailyRules = rules.filter(x =>
        x.type === `daily`)
    if(dailyRules.length > 0) 
        formatDailyResponse(dailyRules, startDate, endDate, response)



    callBack(response)
}

function formatSpecificDaysResponse (rules, response) { 
    rules.forEach(element => {
        const newRule = {}
        newRule.day = element.day
        newRule.intervals = element.intervals
        response.push(newRule)
    })
}

function formatDailyResponse (rules, startDate, endDate, response) { 
    rules.forEach(element => {
        let day = startDate.clone()
        while(endDate.isSameOrAfter(day)) {
            const newRule = {}
            newRule.day = day.format('DD-MM-YYYY').toString()
            newRule.intervals = element.intervals
            response.push(newRule)
            day.add(1, 'days')
        }
    })
}

module.exports.getWorkingHours = getWorkingHours