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

describe('/api/review/:review_id', () => {

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

                        expect(res.body.review.comment_count).toBe('3')

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

})