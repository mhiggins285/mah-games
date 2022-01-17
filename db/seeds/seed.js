const db = require("../connection.js")
const format = require("pg-format")

const seed = (data) => {

  const { categoryData, commentData, reviewData, userData } = data
  
  return db
    .query(`DROP TABLE IF EXISTS categories;`)
    .then(() => {
      return db.query("DROP TABLE IF EXISTS comments;")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS reviews;")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;")
    })
    .then(() => {
      return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) NOT NULL PRIMARY KEY,
        description VARCHAR(1000) 
      );`)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR(25) NOT NULL PRIMARY KEY,
        avatar_url VARCHAR(100),
        name VARCHAR(50)
      );`)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        review_body VARCHAR(2000) NOT NULL,
        designer VARCHAR(50),
        review_img_url VARCHAR(100),
        votes INTEGER DEFAULT 0,
        category VARCHAR(50) NOT NULL REFERENCES categories(slug),
        owner VARCHAR(25) NOT NULL REFERENCES users(username),
        created_at TIMESTAMP DEFAULT GETDATE()
      );`)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(25) NOT NULL REFERENCES users(username),
        review_id INTEGER NOT NULL REFERENCE reviews(review_id),
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT GETDATE(),
        body VARCHAR(1000) NOT NULL
      );`)
    })
    .then(() => {
      const query = format(
        `INSERT INTO categories
          (slug, description)
          VALUES
          %L;`,
        categoryFormat(categoryData)
      );
      return db.query(query);
    })
    .then(() => {
      const query = format(
        `INSERT INTO users
          (username, name, avatar_url)
          VALUES
          %L;`,
        userFormat(userData)
      );
      return db.query(query);
    })
    .then(() => {
      const query = format(
        `INSERT INTO reviews
          (title, designer, owner, review_img_url, review_body, category, created_at, votes)
          VALUES
          %L;`,
        reviewFormat(reviewData)
      );
      return db.query(query);
    })
    .then(() => {
      const query = format(
        `INSERT INTO comments
          (body, votes, author, review_id, created_at)
          VALUES
          %L;`,
        commentFormat(commentData)
      );
      return db.query(query);
    })

};

module.exports = seed;
