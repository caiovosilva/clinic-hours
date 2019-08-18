const moment = require('moment')

function getWorkingHours(startDate, endDate, rules, callBack) {
    const response = []
    while(endDate.isSameOrAfter(startDate)) {
        const newRule = {}
        newRule.day = startDate.format('DD-MM-YYYY').toString()
        newRule.intervals = []
        rules.forEach(element => {
            switch (element.type) {
                case `specificDay`:
                    if(moment(element.day, 'DD-MM-YYYY').isSame(startDate))
                        element.intervals.forEach(interval => {
                            newRule.intervals.push(interval)
                        });
                    break;
                case `weekly`:
                    const dayOfWeek = startDate.day()
                    if(dayOfWeek === element.dayOfWeek)
                        element.intervals.forEach(interval => {
                            newRule.intervals.push(interval)
                        });
                    break;
                case `daily`:
                    element.intervals.forEach(interval => {
                        newRule.intervals.push(interval)
                    });
                    break;
            }
        })
        if(newRule.intervals.length > 0)
            response.push(newRule)
        startDate.add(1, 'd')
    }

    response.sort((a, b) => {
        if(moment(a).isAfter(moment(b)))
            return 1
        return -1
    })

    callBack(response)
}

module.exports.getWorkingHours = getWorkingHours