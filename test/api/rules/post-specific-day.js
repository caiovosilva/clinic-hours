const expect = require('chai').expect
const request = require('supertest')

const app = require('../../../src/app.js')

describe('POST /rules', () => {
    it('Creating a new rule for specific day works', (done) => {
        request(app).post('/rules').send(
            {
	            "specificDay": 
                {
                    "day": "04-01-2018",
                    "intervals": [
                        {
                            "start": "14:30", "end": "15:00" 
                        }, { 
                            "start": "15:10", "end": "15:30" 
                        }
                    ]
                }
            }
        ).then((res) => {
            const body = res.body
            expect(body).to.contain.property('id')
            expect(body).to.contain.property('day')
            expect(body).to.contain.property('type')
            expect(body).to.contain.property('intervals')
            done()
        })
        .catch(err => done(err))
    })
})