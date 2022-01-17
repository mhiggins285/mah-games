const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('seed works correctly', () => {

    test('category table correctly seeded', () => {

        return db.query(`SELECT * FROM categories;`)
            .then((res) => {

                console.log('categories:\n', res.rows)

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

                console.log('users:\n:', res.rows)

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

                console.log('reviews:\n:', res.rows)

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

                console.log('comments:\n:', res.rows)

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