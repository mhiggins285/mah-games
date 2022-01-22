exports.formatCategory = ( categories ) => {

    return categories.map((category) => {

        return [ category.slug, category.description ]

    })

}

exports.formatUser = ( users ) => {

    return users.map((user) => {

        return [ user.username, user.name, user.avatar_url ]

    })

}

exports.formatReview = ( reviews ) => {

    return reviews.map((review) => {

        return [ review.title, review.designer, review.owner, review.review_img_url, review.review_body, review.category, review.created_at, review.votes ]

    })
    

}

exports.formatComment = ( comments ) => {

    return comments.map((comment) => {

        return [ comment.body, comment.votes, comment.author, comment.review_id, comment.created_at ]

    })
    

}