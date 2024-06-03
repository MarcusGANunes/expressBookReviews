const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body
  if (!username) {
    res.status(400).json(JSON.stringify({message: 'Username is missing'}))
  }
  else if (!password) {
    res.status(400).json(JSON.stringify({message: 'Password is missing'}))
  }
  else if (users.some(user => user.hasOwnProperty(username))) {
    res.status(400).json(JSON.stringify({message: 'Choose another username'}))
  }
  else {
    users.push({[username]: password})
    return res.status(300).json({message: "User registered successfully"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book_details = books[isbn]
  return res.status(200).json(JSON.stringify(book_details))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let books_details = []
  for(const book in books) {
    if(books[book]['author'] === author) books_details.push({...books[book], isbn: book})
  }
  return res.status(200).json(JSON.stringify(books_details))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let book_details = null
  for(const book in books) {
    if(books[book]['title'] === title) book_details = {...books[book], isbn: book}
  }
  return res.status(200).json(JSON.stringify(book_details))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let book_review = null
  for(const book in books) {
    if(books[book]['isbn'] === isbn) book_review = books[book]['review']
  }
  return res.status(300).json(JSON.stringify(book_review))
});

module.exports.general = public_users;
