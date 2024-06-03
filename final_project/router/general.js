const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const get_books_list = () => new Promise((resolve, reject) => {
  try {
    resolve(books);
  }
  catch (err) {
    reject(err);
  }
})

const get_details_by_isbn = isbn => new Promise((resolve, reject) => {
  try {
    resolve(books[isbn]);
  }
  catch (err) {
    reject(err);
  }
})

const get_details_by_author = author => new Promise((resolve, reject) => {
  try {
    let books_details = []
    for(const book in books) {
      if(books[book]['author'] === author) books_details.push({...books[book], isbn: book})
    }
    resolve(books_details);
  }
  catch (err) {
    reject(err);
  }
})

const get_details_by_title = title => new Promise((resolve, reject) => {
  try {
    for(const book in books) {
      if(books[book]['title'] === title) resolve({...books[book], isbn: book})
    }
  }
  catch (err) {
    reject(err);
  }
})

public_users.post("/register", (req,res) => {
  const { username, password } = req.body
  if (!username) {
    res.status(400).json({message: 'Username is missing'})
  }
  else if (!password) {
    res.status(400).json({message: 'Password is missing'})
  }
  else if (users.some(user => user['username'] === username)) {
    res.status(400).json({message: 'Choose another username'})
  }
  else {
    users.push({ username, password })
    return res.status(300).json({message: "User registered successfully"})
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  get_books_list
    .then(books => {
      return res.status(200).json(books)
    })
    .catch(err => {
      return res.status(500).json({ message: 'Error when retrieving books list' })
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  get_details_by_isbn(isbn)
    .then(details => {
      return res.status(200).json(details)
    })
    .catch(err => {
      return res.status(404).json({ message: 'Error when retrieving book details' })
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  get_details_by_author(author)
    .then(details => {
      return res.status(200).json(details)
    })
    .catch(err => {
      return res.status(404).json({ message: 'Error when retrieving books details by author' })
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  get_details_by_title(title)
    .then(details => {
      return res.status(200).json(details)
    })
    .catch(err => {
      return res.status(404).json({ message: 'Error when retrieving books details by title' })
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let book_reviews = books[isbn]['reviews']
  return res.status(200).json(book_reviews)
});

module.exports.general = public_users;
