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
    const weeklyRules= rules.filter(x =>
        x.type === `weekly`)
    if(dailyRules.length > 0 || weeklyRules.length > 0 ) 
        formatDailyAndWeeklyResponse(dailyRules, weeklyRules, startDate, endDate, response)

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

//I was going to put daily and weekly formats in separate functions, but to only iterate through the days only once, I put then together
function formatDailyAndWeeklyResponse (dailyRules, weeklyRules, startDate, endDate, response) { 
    let day = startDate.clone()
    while(endDate.isSameOrAfter(day)) {
        dailyRules.forEach(element => {
            const newRule = {}
            newRule.day = day.format('DD-MM-YYYY').toString()
            newRule.intervals = element.intervals
            response.push(newRule)
        })
        const dayOfWeek = day.day()
        weeklyRules.forEach(element => {
            if(dayOfWeek === element.dayOfWeek){
                const newRule = {}
                newRule.day = day.format('DD-MM-YYYY').toString()
                newRule.intervals = element.intervals
                response.push(newRule)
            }
        })
        day.add(1, 'days')
    }
}

module.exports.getWorkingHours = getWorkingHours