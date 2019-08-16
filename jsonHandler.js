const fs = require('fs')

function postRule(rule) {
    console.log(rule)
    try {
        fs.readFile('rules.json', 'utf8', function readFileCallback(err, data){
            if (err){
                return console.log(err);
            }
            obj = JSON.parse(data); //now it an object
            //obj.`${rule.type}`.push(rule) //add some data
            obj.rules.push(rule); 
            jsonRules = JSON.stringify(obj); //convert it back to json
            fs.writeFile('./rules.json', jsonRules, 'utf8', (err) => {
                if (err) throw err
            }); // write it back 
        });      
    } catch (err) {
        return console.error(err)
    }
}

module.exports.postRule = postRule