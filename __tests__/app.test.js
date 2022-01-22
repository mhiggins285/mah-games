const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app.js')
const request = require('supertest')
const fs = require('fs/promises')


beforeEach(() => seed(testData))

describe('seed works correctly', () => {

    test('category table correctly seeded', () => {

        return db.query(`SELECT * FROM categories;`)
            .then((res) => {

                expect(res.rows.length).toBe(4)

                res.rows.forEach((category) => {

                    expect(category).toEqual(
                    expect.objectContaining({

                        slug: expect.any(String),
                        description: expect.any(String)

                    })
                    )

                })

            })

    })

    test('user table correctly seeded', () => {

        return db.query(`SELECT * FROM users;`)
            .then((res) => {

                expect(res.rows.length).toBe(4)

                res.rows.forEach((user) => {

                    expect(user).toEqual(
                    expect.objectContaining({

                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)

                    })
                    )

                })

            })

    })

    test('review table correctly seeded', () => {

        return db.query(`SELECT * FROM reviews;`)
            .then((res) => {

                expect(res.rows.length).toBe(13)

                res.rows.forEach((review) => {

                    expect(review).toEqual(
                    expect.objectContaining({

                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(Date),
                        votes: expect.any(Number)

                    })
                    )

                })

            })

    })

    test('comment table correctly seeded', () => {

        return db.query(`SELECT * FROM comments;`)
            .then((res) => {

                expect(res.rows.length).toBe(6)

                res.rows.forEach((comment) => {

                    expect(comment).toEqual(
                    expect.objectContaining({

                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        review_id: expect.any(Number),
                        created_at: expect.any(Date),
                        votes: expect.any(Number)

                    })
                    )

                })

            })

    })

})

describe('*', () => {

    describe('all', () => {

        test('returns error when a request is made to a non-existent endpoint', () => {

            return request(app)
                    .get('/api/cars')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Endpoint does not exist')

                    })

        })

    })

})

describe('/api/categories', () => {

    describe('GET', () => {

        test('returns array of category objects', () => {

            return request(app)
                    .get('/api/categories')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.categories.length).toBe(4)

                        res.body.categories.forEach((category) => {

                            expect(category).toEqual(
                            expect.objectContaining({

                                slug: expect.any(String),
                                description: expect.any(String)

                            })
                            )

                        })

                    })

        })

    })

})

describe('/api/reviews/:review_id', () => {

    describe('GET', () => {

        test('returns object containing properties from review database', () => {

            return request(app)
                    .get('/api/reviews/3')
                    .expect(200)
                    .then((res) => {

                        const review = res.body.review

                        expect(review.review_id).toBe(3)
                        expect(review.title).toBe('Ultimate Werewolf')
                        expect(review.designer).toBe('Akihisa Okui')
                        expect(review.owner).toBe('bainesface')
                        expect(review.review_img_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
                        expect(review.review_body).toBe("We couldn't find the werewolf!")
                        expect(review.category).toBe('social deduction')
                        expect(new Date(review.created_at)).toEqual(new Date(1610964101251))
                        expect(review.votes).toBe(5)

                    })

        })

        test('review object contains comment_count property containing no. of associated comments', () => {

            return request(app)
                    .get('/api/reviews/3')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.review.comment_count).toBe(3)

                    })

        })

        test('still works correctly when review has no associated comments', () => {

            return request(app)
                    .get('/api/reviews/1')
                    .expect(200)
                    .then((res) => {

                        const review = res.body.review

                        expect(review.review_id).toBe(1)
                        expect(review.title).toBe('Agricola')
                        expect(review.designer).toBe('Uwe Rosenberg')
                        expect(review.owner).toBe('mallionaire')
                        expect(review.review_img_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
                        expect(review.review_body).toBe("Farmyard fun!")
                        expect(review.category).toBe('euro game')
                        expect(new Date(review.created_at)).toEqual(new Date(1610964020514))
                        expect(review.votes).toBe(1)
                        expect(review.comment_count).toBe(0)

                    })

        })

        test('returns error when review_id that does not exist is entered', () => {

            return request(app)
                    .get('/api/reviews/999')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

                    })

        })

        test('returns error when invalid review_id is entered', () => {

            return request(app)
                    .get('/api/reviews/string')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

    describe('PATCH', () => {

        test('patch request can be used to change the vote count of a review by a specified value', () => {

            return request(app)
                    .patch('/api/reviews/2')
                    .send({ inc_votes: 2 })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.review.votes).toBe(7)

                    })

        })

        test('patch request can be used to change the vote count of a review by negative values', () => {

            return request(app)
                    .patch('/api/reviews/3')
                    .send({ inc_votes: -6 })
                    .expect(200)
                    .then((res) => {

                        expect(res.body.review.votes).toBe(-1)

                    })

        })

        test('returns error when trying to patch review that does not exist', () => {

            return request(app)
                    .patch('/api/reviews/999')
                    .send({ inc_votes: 1 })
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

                    })

        })

        test('returns error when invalid review_id is entered', () => {

            return request(app)
                    .patch('/api/reviews/string')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when body of request does not contain inc_votes property', () => {

            return request(app)
                    .patch('/api/reviews/4')
                    .send({ ince_vote: 4 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not a number', () => {

            return request(app)
                    .patch('/api/reviews/4')
                    .send({ inc_votes: 'Four' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not an integer', () => {

            return request(app)
                    .patch('/api/reviews/4')
                    .send({ inc_votes: 4.2 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})

describe('/api/reviews', () => {

    describe('GET', () => {

        test('returns with an array of each review populated with properties from the review database', () => {

            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then((res) => {

                    expect(res.body.reviews.length).toBe(13)

                    res.body.reviews.forEach((review) => {

                        expect(review).toEqual(
                        expect.objectContaining({

                            review_id: expect.any(Number),
                            title: expect.any(String),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            review_body: expect.any(String),
                            category: expect.any(String),
                            votes: expect.any(Number)

                        })
                        )

                        expect(new Date(review.created_at)).toEqual(expect.any(Date))

                    })

                })

        })

        test('each array has a comment count property', () => {

            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then((res) => {

                    res.body.reviews.forEach((review) => {

                        expect(review).toEqual(
                        expect.objectContaining({

                            comment_count: expect.any(Number)

                        })
                        )

                        if (review.review_id === 1) {

                            expect(review.comment_count).toBe(0)

                        }

                        if (review.review_id === 3) {

                            expect(review.comment_count).toBe(3)

                        }

                    })

                })

        })

        test('defaults to sorting entries by date', () => {

            return request(app)
                        .get('/api/reviews')
                        .expect(200)
                        .then((res) => {

                            expect(res.body.reviews).toBeSortedBy('created_at', { descending: true })  

                        })

        })

        test('can be sorted by other fields based on query', () => {

            return request(app)
                        .get('/api/reviews?sort_by=votes')
                        .expect(200)
                        .then((res) => {

                            expect(res.body.reviews).toBeSortedBy('votes', { descending: false })  

                        })

        })

        test('can be sorted in ascending or descending order based on query', () => {

            return request(app)
                        .get('/api/reviews?sort_by=designer&order=desc')
                        .expect(200)
                        .then((res) => {

                            expect(res.body.reviews).toBeSortedBy('designer', { descending: true })  

                        })

        })

        test('can be filtered by category based on query', () => {

            return request(app)
                        .get('/api/reviews?category=dexterity')
                        .expect(200)
                        .then((res) => {

                            expect(res.body.reviews.length).toBe(1)

                            res.body.reviews.forEach((review) => {

                                expect(review.category).toBe('dexterity')

                            })

                        })


        })

        test('all three of the above queries can be applied simultaneously', () => {

            return request(app)
                        .get('/api/reviews?sort_by=owner&order=desc&category=social_deduction')
                        .expect(200)
                        .then((res) => {
                            
                            expect(res.body.reviews.length).toBe(11)

                            expect(res.body.reviews).toBeSortedBy('owner', { descending: true })  

                            res.body.reviews.forEach((review) => {

                                expect(review.category).toBe('social deduction')

                            })

                        })


        })

        test('returns error if invalid sort_by query is inputted', () => {

            return request(app)
                        .get('/api/reviews?sort_by=salary')
                        .expect(400)
                        .then((res) => {

                            expect(res.body.message).toBe('Bad request')

                        })

        })

        test('return error if invalid order query is inputted', () => {

            return request(app)
                        .get('/api/reviews?order=alternating')
                        .expect(400)
                        .then((res) => {

                            expect(res.body.message).toBe('Bad request')

                        })

        })

        test('does not return error if queries result in an empty response', () => {

            return request(app)
                        .get("/api/reviews?category=children's_games")
                        .expect(200)
                        .then((res) => {

                            expect(res.body.reviews).toEqual([])

                        })

        })

        test('returns an error if category does not exist', () => {

            return request(app)
                        .get("/api/reviews?category=strategy")
                        .expect(422)
                        .then((res) => {

                            expect(res.body.message).toEqual('Category does not exist')

                        })

        })

    })

})

describe('/api/reviews/:review_id/comments', () => {

    describe('GET', () => {

        test('returns an array of comments for a given review containing required properties', () => {
            
            return request(app)
                    .get('/api/reviews/2/comments')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comments.length).toBe(3)

                        res.body.comments.forEach((comment) => {

                            expect(comment.review_id).toBe(2),
                            expect.objectContaining({

                                comment_id: expect.any(Number),
                                body: expect.any(String),
                                author: expect.any(String),
                                created_at: expect.any(Date),
                                votes: expect.any(Number)
        
                            })

                        })

                    })

        })

        test('returns an error if review id does not exist', () => {

            return request(app)
                    .get('/api/reviews/999/comments')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

                    })

        })

        test('returns error when invalid review_id is entered', () => {

            return request(app)
                    .get('/api/reviews/string/comments')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('does not return an error if a review does exist but it has no associated comments', () => {

            return request(app)
                    .get('/api/reviews/5/comments')
                    .expect(200)

        })

    })

    describe('POST', () => {

        test('adds comment to the database', () => {

            return request(app)
                    .post('/api/reviews/5/comments')
                    .send({ user: 'bainesface',
                            body: 'I disagree' })
                    .expect(201)
                    .then((res) => {

                        const { comment } = res.body

                        expect(comment.body).toBe('I disagree')
                        expect(comment.votes).toBe(0)
                        expect(comment.author).toBe('bainesface')
                        expect(new Date(comment.created_at)).toEqual(expect.any(Date))
                        expect(comment.comment_id).toEqual(expect.any(Number))
                        
                    })


        })

        test('return an error when review id does not exist', () => {

            return request(app)
                    .post('/api/reviews/999/comments')
                    .send({ user: 'bainesface',
                            body: 'I disagree' })
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

                    })

        })

        test('returns error when invalid review_id is entered', () => {

            return request(app)
                    .post('/api/reviews/string/comments')
                    .send({ user: 'bainesface',
                            body: 'I disagree' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('return an error when comment does not have body field', () => {

            return request(app)
                    .post('/api/reviews/5/comments')
                    .send({ user: 'bainesface',
                            budy: 'I disagree' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when comment does not have user field', () => {

            return request(app)
                    .post('/api/reviews/5/comments')
                    .send({ uter: 'bainesface',
                            body: 'I disagree' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when username does not exist', () => {

            return request(app)
                    .post('/api/reviews/5/comments')
                    .send({ user: 'L285',
                            body: 'I disagree' })
                    .expect(422)
                    .then((res) => {

                        expect(res.body.message).toBe('User does not exist')

                    })
            
        })

        test('return an error when body is empty', () => {

            return request(app)
                    .post('/api/reviews/5/comments')
                    .send({ user: 'bainesface',
                            body: '' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when body is too long', () => {

            const longBody = 'a'.repeat(4000)

            return request(app)
                    .post('/api/reviews/5/comments')
                    .send({ user: 'bainesface',
                            body: longBody })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Comment body too long')

                    })
            
        })

    })

})

describe('/api/comments/:comment_id', () => {

    describe('DELETE', () => {

        test('deletes comment from database and returns empty object', () => {

            return request(app)
                    .delete('/api/comments/3')
                    .expect(204)
                    .then((res) => {

                        expect(res.body).toEqual({})

                        const query = `SELECT * FROM comments
                                        WHERE comment_id = 3;`

                        return db.query(query)

                    })
                    .then((res) => {

                        expect(res.rows).toEqual([])

                    })

        })

        test('returns an error if the comment id does not exist', () => {

            return request(app)
                    .delete('/api/comments/999')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Comment does not exist')

                    })

        })

        test('returns error when invalid comment_id is entered', () => {

            return request(app)
            .delete('/api/comments/string')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})

describe('/api', () => {

    describe('GET', () => {

        test('returns JSON containing available endpoints', () => {

            const requestPromise = request(app)
                    .get('/api')
                    .expect(200)

            const readFilePromise = fs.readFile('endpoints.json', 'utf-8')

            return Promise.all([requestPromise, readFilePromise])
                    .then(([res, endpoints]) => {

                        expect(res.text).toEqual(endpoints)

                    })

        })

    })

})

describe('all existing endpoints', () => {

    describe('any unpermitted method', () => {

        test('specific error returned if endpoint exists but method is not allowed', () => {

            return request(app)
                    .patch('/api/categories')
                    .expect(405)
                    .then((res) => {

                        expect(res.body.message).toBe('Method not allowed')

                    })

        })

    })

})