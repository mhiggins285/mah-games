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