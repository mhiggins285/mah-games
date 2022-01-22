const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app.js')
const request = require('supertest')

beforeEach(() => seed(testData))

describe('/api/reviews/:review_id/body', () => {

    describe('PATCH', () => {

        test('patch request can be used to change the body of a review', () => {

            return request(app)
                    .patch('/api/reviews/2/body')
                    .send({ review_body: "This was ace" })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.review.review_id).toBe(2)
                        expect(res.body.review.review_body).toBe("This was ace")

                    })

        })

        test('returns error when trying to patch review that does not exist', () => {

            return request(app)
                    .patch('/api/reviews/999/body')
                    .send({ review_body: "This was ace" })
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

                    })

        })

        test('returns error when invalid review_id is entered', () => {

            return request(app)
                    .patch('/api/reviews/string/body')
                    .send({ review_body: "This was ace" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when body of request does not contain review_body property', () => {

            return request(app)
                    .patch('/api/reviews/4/body')
                    .send({ reviewb_ody: "This was ace" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when review_body is empty string', () => {

            return request(app)
                    .patch('/api/reviews/4/body')
                    .send({ review_body: "" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when review_body value is too long', () => {

            const longBody = 'a'.repeat(4000)

            return request(app)
                    .patch('/api/reviews/4/body')
                    .send({ review_body: longBody})
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Review body too long')

                    })

        })

    })

})

describe('/api/comments/:comment_id/body', () => {

    describe('PATCH', () => {

        test('patch request can be used to change the body of a comment', () => {

            return request(app)
                    .patch('/api/comments/2/body')
                    .send({ body: "This was ace" })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comment.comment_id).toBe(2)
                        expect(res.body.comment.body).toBe("This was ace")

                    })

        })

        test('returns error when trying to patch comment that does not exist', () => {

            return request(app)
                    .patch('/api/comments/999/body')
                    .send({ body: "This was ace" })
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Comment does not exist')

                    })

        })

        test('returns error when invalid comment_id is entered', () => {

            return request(app)
                    .patch('/api/comments/string/body')
                    .send({ body: "This was ace" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when body of request does not contain body property', () => {

            return request(app)
                    .patch('/api/comments/4/body')
                    .send({ comment_body: "This was ace" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when body is empty string', () => {

            return request(app)
                    .patch('/api/comments/4/body')
                    .send({ body: "" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when body value is too long', () => {

            const longBody = 'a'.repeat(4000)

            return request(app)
                    .patch('/api/comments/4/body')
                    .send({ body: longBody })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Comment body too long')

                    })

        })

    })

})

describe('/api/users', () => {

    describe('POST', () => {

        test('adds user to the database', () => {

            return request(app)
                    .post('/api/users')
                    .send({ username: 'L285',
                            name: 'Michael',
                            avatar_url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png' })
                    .expect(201)
                    .then((res) => {

                        const { user } = res.body

                        expect(user.username).toBe('L285')
                        expect(user.name).toBe('Michael')
                        expect(user.avatar_url).toBe('https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png')
                        
                    })


        })

        test('return an error when category does not have username field', () => {

            return request(app)
                    .post('/api/users')
                    .send({ utername: 'L285',
                            name: 'Michael',
                            avatar_url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('functions correctly if name and avatar_url are not provided', () => {

            return request(app)
                    .post('/api/users')
                    .send({ username: 'L285' })
                    .expect(201)
                    .then((res) => {

                        expect(res.body.user.username).toBe('L285')

                    })
            
        })

        test('return an error when category with a username that already exists', () => {

            return request(app)
                    .post('/api/users')
                    .send({ username: 'bainesface',
                            name: 'Michael',
                            avatar_url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png' })
                    .expect(422)
                    .then((res) => {

                        expect(res.body.message).toBe('Username already taken')

                    })
            
        })

        test('return an error when username is empty', () => {

            return request(app)
                    .post('/api/users')
                    .send({ username: '',
                            name: 'Michael',
                            avatar_url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when username is too long', () => {

            const longUsername = 'a'.repeat(30)

            return request(app)
                    .post('/api/users')
                    .send({ username: longUsername,
                            name: 'Michael',
                            avatar_url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Username too long')

                    })
            
        })

        test('return an error when name is too long', () => {

            const longName = 'a'.repeat(70)

            return request(app)
                    .post('/api/users')
                    .send({ username: 'L285',
                            name: longName,
                            avatar_url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d8/285Shroomish.png/250px-285Shroomish.png' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Name too long')

                    })
            
        })

        test('return an error when avatar_url is too long', () => {

            const longUrl = 'a'.repeat(300)

            return request(app)
                    .post('/api/users')
                    .send({ username: 'L285',
                            name: 'Michael',
                            avatar_url: longUrl })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Avatar URL too long')

                    })
            
        })

    })

})

describe('/api/users/:username', () => {

    describe('PATCH', () => {

        test('patch request can be used to change the name of a user', () => {

            return request(app)
                    .patch('/api/users/bainesface')
                    .send({ name: 'bainesy' })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.user.username).toBe('bainesface')
                        expect(res.body.user.name).toBe('bainesy')
                        expect(res.body.user.avatar_url).toBe('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4')

                    })

        })

        test('patch request can be used to change the avatar_url of a user', () => {

            return request(app)
                    .patch('/api/users/bainesface')
                    .send({ avatar_url: 'https://img.pokemondb.net/artwork/large/oddish.jpg' })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.user.username).toBe('bainesface')
                        expect(res.body.user.name).toBe('sarah')
                        expect(res.body.user.avatar_url).toBe('https://img.pokemondb.net/artwork/large/oddish.jpg')

                    })

        })

        test('patch request can be used to change the name and avatar_url of a user', () => {

            return request(app)
                    .patch('/api/users/bainesface')
                    .send({ name: 'bainesy',
                            avatar_url: 'https://img.pokemondb.net/artwork/large/oddish.jpg' })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.user.username).toBe('bainesface')
                        expect(res.body.user.name).toBe('bainesy')
                        expect(res.body.user.avatar_url).toBe('https://img.pokemondb.net/artwork/large/oddish.jpg')

                    })

        })

        test('returns error when trying to patch user that does not exist', () => {

            return request(app)
                    .patch('/api/users/L285')
                    .send({ name: 'Mickey' })
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('User does not exist')

                    })

        })

        test('returns error when body of request does not contain either name or avatar_url', () => {

            return request(app)
                    .patch('/api/users/bainesface')
                    .send({ description: "I love Oddish" })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when name value is too long', () => {

            const longName = 'a'.repeat(70)

            return request(app)
                    .patch('/api/users/bainesface')
                    .send({ name: longName })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Name too long')

                    })

        })

        test('returns error when avatar_url value is too long', () => {

            const longUrl = 'a'.repeat(300)

            return request(app)
                    .patch('/api/users/bainesface')
                    .send({ avatar_url: longUrl })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Avatar URL too long')

                    })

        })

    })

})