const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app.js')
const request = require('supertest')

beforeEach(() => seed(testData))

describe('/api/users', () => {

    describe('GET', () => {

        test('returns array of user objects', () => {

            return request(app)
                    .get('/api/users')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.users.length).toBe(4)

                        res.body.users.forEach((user) => {

                            expect(user).toEqual(
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
                    .patch('/api/comments/1')
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

        test('returns error when invalid comment_id is entered', () => {

            return request(app)
                    .patch('/api/comments/string')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })        

        test('returns error when body of request does not contain inc_votes property', () => {

            return request(app)
                    .patch('/api/comments/4')
                    .send({ ince_vote: 4 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not a number', () => {

            return request(app)
                    .patch('/api/comments/4')
                    .send({ inc_votes: 'Four' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not an integer', () => {

            return request(app)
                    .patch('/api/comments/4')
                    .send({ inc_votes: 4.2 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})

describe('/api/reviews', () => {

    describe('POST', () => {

        test('adds review to the database', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                            title: 'Ball and cup',
                            review_body: 'Hours of mindless fun',
                            designer: 'Johnny Ball',
                            category: 'dexterity' })
                    .expect(201)
                    .then((res) => {

                        const { review } = res.body

                        expect(review.review_id).toEqual(expect.any(Number))
                        expect(review.owner).toBe('bainesface')
                        expect(review.title).toBe('Ball and cup')
                        expect(review.review_body).toBe('Hours of mindless fun')
                        expect(review.designer).toBe('Johnny Ball')
                        expect(review.category).toBe('dexterity')
                        expect(review.votes).toBe(0)
                        expect(new Date(review.created_at)).toEqual(expect.any(Date))
                        expect(review.comment_count).toBe(0)
                        
                    })


        })

        test('return an error when review does not have owner field', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ user: 'bainesface',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when review does not have title field', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        tidle: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when review does not have review_body field', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        reviewb_ody: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when review does not have designer field', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        desiner: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when review does not have category field', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        caregory: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when username does not exist', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'L285',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(422)
                    .then((res) => {

                        expect(res.body.message).toBe('User does not exist')

                    })
            
        })

        test('return an error when category does not exist', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'physical' })
                    .expect(422)
                    .then((res) => {

                        expect(res.body.message).toBe('Category does not exist')

                    })
            
        })

        test('return an error when title is empty', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: '',
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when review body is empty', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: '',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when designer is empty', () => {

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: '',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when title is too long', () => {

            const longTitle = 'a'.repeat(300)

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: longTitle,
                        review_body: 'Hours of mindless fun',
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Title too long')

                    })
            
        })

        test('return an error when body is too long', () => {

            const longBody = 'a'.repeat(4000)

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: longBody,
                        designer: 'Johnny Ball',
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Review body too long')

                    })
            
        })

        test('return an error when designer is too long', () => {

            const longDesigner = 'a'.repeat(70)

            return request(app)
                    .post('/api/reviews')
                    .send({ owner: 'bainesface',
                        title: 'Ball and cup',
                        review_body: 'Hours of mindless fun',
                        designer: longDesigner,
                        category: 'dexterity' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Designer name too long')

                    })
            
        })

    })

    describe('GET', () => {

        test('limit and p queries can be used to return a subset of reviews', () => {

            return request(app)
                    .get('/api/reviews?limit=5&p=2&sort_by=review_id')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.reviews.length).toBe(5)
                        expect(res.body.reviews[0].review_id).toBe(6)
                        expect(res.body.reviews[4].review_id).toBe(10)

                    })

        })

        test('if limit is provided without p, defaults to first page', () => {

            return request(app)
                    .get('/api/reviews?limit=5&sort_by=review_id')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.reviews.length).toBe(5)
                        expect(res.body.reviews[0].review_id).toBe(1)
                        expect(res.body.reviews[4].review_id).toBe(5)

                    })            

        })

        test('if p is provided with limit, returns error', () => {

            
            return request(app)
                    .get('/api/reviews?p=2&sort_by=review_id')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Page query cannot be provided without limit query')

                    })

        })

        test("doesn't return error if page contains fewer than limit value results", () => {

            return request(app)
                    .get('/api/reviews?limit=5&p=3&sort_by=review_id')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.reviews.length).toBe(3)
                        expect(res.body.reviews[0].review_id).toBe(11)
                        expect(res.body.reviews[2].review_id).toBe(13)

                    })

        })

        test("doesn't return error if limit is greater than number of entries", () => {

            return request(app)
                    .get('/api/reviews?limit=15&p=1&sort_by=review_id')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.reviews.length).toBe(13)
                        expect(res.body.reviews[0].review_id).toBe(1)
                        expect(res.body.reviews[12].review_id).toBe(13)

                    })
            
        })

        test("doesn't return error if page is empty", () => {

            return request(app)
                    .get('/api/reviews?limit=5&p=4&sort_by=review_id')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.reviews).toEqual([])

                    })
        
        })

        test('pagination works correctly when used with other queries', () => {

            return request(app)
                    .get('/api/reviews?limit=5&p=2&sort_by=owner&order=desc&category=social_deduction')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.reviews.length).toBe(5)
                        expect(res.body.reviews[0].review_id).toBe(8)
                        expect(res.body.reviews[4].review_id).toBe(12)

                    })

        })

        test('return error if limit is not an integer', () => {

            return request(app)
                    .get('/api/reviews?limit=5.5&p=2&sort_by=review_id')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('return error if p is not an integer', () => {

            return request(app)
                    .get('/api/reviews?limit=5&p=2.5&sort_by=review_id')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('return error if limit or p are not numbers', () => {

            return request(app)
                    .get('/api/reviews?limit=five&p=two&sort_by=review_id')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})

describe('/api/categories', () => {

    describe('POST', () => {

        test('adds category to the database', () => {

            return request(app)
                    .post('/api/categories')
                    .send({ slug: 'strategy',
                            description: 'games that require tactical and strategic thinking to win' })
                    .expect(201)
                    .then((res) => {

                        const { category } = res.body

                        expect(category.slug).toBe('strategy')
                        expect(category.description).toBe('games that require tactical and strategic thinking to win')
                        
                    })


        })

        test('return an error when category does not have slug field', () => {

            return request(app)
                    .post('/api/categories')
                    .send({ name: 'strategy',
                            description: 'games that require tactical and strategic thinking to win' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when category does not have description field', () => {

            return request(app)
                    .post('/api/categories')
                    .send({ slug: 'strategy',
                            depiction: 'games that require tactical and strategic thinking to win' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when category with that slug already exists', () => {

            return request(app)
                    .post('/api/categories')
                    .send({ slug: 'social deduction',
                            description: 'games that require tactical and strategic thinking to win' })
                    .expect(422)
                    .then((res) => {

                        expect(res.body.message).toBe('Category already exists')

                    })
            
        })

        test('return an error when slug is empty', () => {

            return request(app)
                    .post('/api/categories')
                    .send({ slug: '',
                            description: 'games that require tactical and strategic thinking to win' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when description is empty', () => {

            return request(app)
                    .post('/api/categories')
                    .send({ slug: 'strategy',
                            description: '' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })
            
        })

        test('return an error when slug is too long', () => {

            const longSlug = 'a'.repeat(70)

            return request(app)
                    .post('/api/categories')
                    .send({ slug: longSlug,
                            description: 'games that require tactical and strategic thinking to win' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Category name too long')

                    })
            
        })

        test('return an error when description is too long', () => {

            const longDescription = 'a'.repeat(1200)

            return request(app)
                    .post('/api/categories')
                    .send({ slug: 'strategy',
                            description: longDescription })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Description too long')

                    })
            
        })


    })

})

describe('/api/reviews/:review_id', () => {

    describe('DELETE', () => {

        test('deletes review from database and returns empty object', () => {

            return request(app)
                    .delete('/api/reviews/3')
                    .expect(204)
                    .then((res) => {

                        expect(res.body).toEqual({})

                        const query = `SELECT * FROM reviews
                                        WHERE review_id = 3;`

                        return db.query(query)

                    })
                    .then((res) => {

                        expect(res.rows).toEqual([])

                    })

        })

        test('deletes all comments associated with review', () => {

            return request(app)
                    .delete('/api/reviews/3')
                    .expect(204)
                    .then(() => {

                        const query = `SELECT * FROM comments
                                        WHERE review_id = 3;`

                        return db.query(query)

                    })
                    .then((res) => {

                        expect(res.rows).toEqual([])

                    })

        })

        test('returns an error if the review id does not exist', () => {

            return request(app)
                    .delete('/api/reviews/999')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

                    })

        })

        test('returns error when invalid review_id is entered', () => {

            return request(app)
                    .delete('/api/reviews/string')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})

describe('/api/reviews/:review_id/comments', () => {

    describe('GET', () => {

        test('limit and p queries can be used to return a subset of comments', () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=2&p=1')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comments.length).toBe(2)
                        expect(res.body.comments[0].comment_id).toBe(1)
                        expect(res.body.comments[1].comment_id).toBe(4)

                    })

        })

        test('if limit is provided without p, defaults to first page', () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=2')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comments.length).toBe(2)
                        expect(res.body.comments[0].comment_id).toBe(1)
                        expect(res.body.comments[1].comment_id).toBe(4)

                    })            

        })

        test('if p is provided with limit, returns error', () => {

            
            return request(app)
                    .get('/api/reviews/2/comments?p=2')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Page query cannot be provided without limit query')

                    })

        })

        test("doesn't return error if page contains fewer than limit value results", () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=2&p=2')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comments.length).toBe(1)
                        expect(res.body.comments[0].comment_id).toBe(5)

                    })

        })

        test("doesn't return error if limit is greater than number of entries", () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=5&p=1')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comments.length).toBe(3)
                        expect(res.body.comments[0].comment_id).toBe(1)
                        expect(res.body.comments[2].comment_id).toBe(5)

                    })
            
        })

        test("doesn't return error if page is empty", () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=5&p=2')
                    .expect(200)
                    .then((res) => {

                        expect(res.body.comments).toEqual([])

                    })
        
        })

        test('return error if limit is not an integer', () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=2.5&p=1')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('return error if p is not an integer', () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=2&p=1.5')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('return error if limit or p are not numbers', () => {

            return request(app)
                    .get('/api/reviews/2/comments?limit=two&p=one')
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})