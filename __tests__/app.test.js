const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app.js')
const request = require('supertest')

beforeEach(() => seed(testData));
afterAll(() => db.end());

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

        test('returns 404 error when a request is made to a non-existent endpoint', () => {

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

        test('returns 404 error when review_id that does not exist is entered', () => {

            return request(app)
                    .get('/api/reviews/999')
                    .expect(404)
                    .then((res) => {

                        expect(res.body.message).toBe('Review does not exist')

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

        test('returns error when body of request does not contain inc_votes property', () => {

            return request(app)
                    .patch('/api/reviews/4')
                    .send({ ince_vote: 'Four' })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not a number', () => {

            return request(app)
                    .patch('/api/reviews/4')
                    .send({ inc_votes: 4.2 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

        test('returns error when inc_votes value is not an integer', () => {

            return request(app)
                    .patch('/api/reviews/4')
                    .send({ ince_votes: 4 })
                    .expect(400)
                    .then((res) => {

                        expect(res.body.message).toBe('Bad request')

                    })

        })

    })

})

describe.only('/api/reviews', () => {

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
                        .get('/api/reviews?category=strategy')
                        .expect(200)
                        .then((res) => {

                            expect(res.body.reviews).toEqual([])

                        })

        })

    })

})