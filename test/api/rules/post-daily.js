const expect = require('chai').expect
const request = require('supertest')

const app = require('../../../app.js')

describe('POST /rules', () => {
    it('Creating a new daily rule works', (done) => {
        request(app).post('/rules').send(
            {
	            "daily": 
                    {
                        "intervals": [
                            {
                                "start": "5:00", "end": "15:00" 
                            }
                        ]
                    }
            }
        ).then((res) => {
            const body = res.body
            expect(body).to.contain.property('id')
            expect(body).to.contain.property('type')
            expect(body).to.contain.property('intervals')
            done()
        })
        .catch(err => done(err))
    })
})