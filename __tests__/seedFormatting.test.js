const { formatCategory, formatUser, formatReview, formatComment } = require('../utils/seedFormatting.js')

describe('functions create arrays of appropriate form to be fed into pg.format', () => {

    test('categories', () => {

        const input = [{ slug: 'war game', description: 'Games replicating battles/wars' },
                    { slug: 'management simulator', description: 'Games replicating the running of a business' },
                    { slug: 'word game', description: 'Games testing players bredth and use of language' }]
        const expected = [['war game', 'Games replicating battles/wars'],
                    ['management simulator', 'Games replicating the running of a business'],
                    ['word game', 'Games testing players bredth and use of language' ]]
        const actual = formatCategory(input)

        expect(actual).toEqual(expected)

    })

    test('users', () => {

        const input = [{ username: 'L285', name: 'Michael', avatar_url: 'coolavatar.com'},
                    { username: 'L286', name: 'Mike', avatar_url: 'coolavatar.co.uk'},
                    { username: 'L287', name: 'Mickey', avatar_url: 'coolavatar.org'}]
        const expected = [['L285', 'Michael', 'coolavatar.com'],
                    ['L286', 'Mike', 'coolavatar.co.uk'],
                    ['L287', 'Mickey', 'coolavatar.org']]
        const actual = formatUser(input)

        expect(actual).toEqual(expected)

    })

    test('reviews', () => {

        const input = [{ title: 'Invade Yorkshire', designer: 'Rose Redd', owner: 'L285', review_img_url: 'coolreviewimages.com', review_body: 'Oooh Lanky Lanky Lancashire', category: 'war games', created_at: new Date(1610964020514), votes: 89 },
                    { title: 'Dobble!', designer: 'Anna Gram', owner: 'L287', review_img_url: 'coolreviewimages.co.uk', review_body: 'Boggle rip-off', category: 'word games', created_at: new Date(1610964020515), votes: 31 }]
        const expected = [['Invade Yorkshire', 'Rose Redd', 'L285', 'coolreviewimages.com', 'Oooh Lanky Lanky Lancashire', 'war games', new Date(1610964020514), 89],
                    ['Dobble!', 'Anna Gram', 'L287', 'coolreviewimages.co.uk', 'Boggle rip-off', 'word games', new Date(1610964020515), 31]]
        const actual = formatReview(input)

        expect(actual).toEqual(expected)
        
    })

    test('comments', () => {

        const input = [{ body: 'I agree', votes: 2, author: 'L286', review_id: 1, created_at: new Date(1610964020714)},
                    { body: 'I disagree', votes: -4, author: 'L285', review_id: 2, created_at: new Date(1610964020715)}]
        const expected = [['I agree', 2, 'L286', 1, new Date(1610964020714)],
                        ['I disagree', -4, 'L285', 2, new Date(1610964020715)]]
        const actual = formatComment(input)

        expect(actual).toEqual(expected)
        
    })

})