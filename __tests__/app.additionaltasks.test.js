const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app.js')
const request = require('supertest')


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/users', () => {

    describe('GET', () => {

        test('returns array of user objects', () => {

            return request(app)
                    .get('/api/users')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.categories.length).toBe(4)

                        res.body.categories.forEach((category) => {

                            expect(category).toEqual(
                            expect.objectContaining({

                                username: expect.any(String)

                            })
                            )

                        })

                    })

        })

    })

})

describe('/api/users/:username', () => {

    describe('GET', () => {

        test('returns object containing properties from user database', () => {

            return request(app)
                    .get('/api/users/bainesface')
                    .expect(200)
                    .then((res) => {

                        const user = res.body.user

                        expect(user.username).toBe('bainesface')
                        expect(user.name).toBe('sarah')
                        expect(user.avatar_url).toBe('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4')

                    })

        })

        test('returns 404 error when user_id that does not exist is entered', () => {

            return request(app)
                    .get('/api/users/L285')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('User does not exist')

                    })

        })

    })

})

describe('/api/comments/:comment_id', () => {

    describe('PATCH', () => {

        test('patch request can be used to change the vote count of a comment by a specified value', () => {

            return request(app)
                    .patch('/api/comments/2')
                    .send({ inc_votes: 2 })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comment.votes).toBe(18)

                    })

        })

        test('patch request can be used to change the vote count of a comment by negative values', () => {

            return request(app)
                    .patch('/api/comments/3')
                    .send({ inc_votes: -6 })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comment.votes).toBe(4)

                    })

        })

        test('returns error when trying to patch comment that does not exist', () => {

            return request(app)
                    .patch('/api/comments/999')
                    .send({ inc_votes: 1 })
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Comment does not exist')

                    })

        })

        test('returns error when body of request does not contain inc_votes property', () => {

            return request(app)
                    .patch('/api/comments/4')
                    .send({ ince_vote: 'Four' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not a number', () => {

            return request(app)
                    .patch('/api/comments/4')
                    .send({ inc_votes: 4.2 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not an integer', () => {

            return request(app)
                    .patch('/api/comments/4')
                    .send({ ince_votes: 4 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})