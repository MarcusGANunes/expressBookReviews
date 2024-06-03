const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return username ? true : false
}

const authenticatedUser = (username,password)=>{
  const valid_users = users.filter(user => user['username'] === username && user['password'] === password)
  return valid_users.length > 0 ? true : false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body
  if(!isValid(username)) {
    return res.status(404).json({ message: 'Username is missing' })
  }
  else if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60*60})
    req.session.authorization = { accessToken, username }
    return res.status(200).json({ message: 'User successfully logged in' })
  }
  else {
    return res.status(404).json({ message: 'Credentials are incorrect' })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn
  review = req.body.review
  username = req.session.authorization.username
  message = `Review ${books[isbn][username] ? 'modified' : 'created'} successfuly`
  books[isbn]['reviews'][username] = review
  return res.status(200).json({ message, review })
});

// Delete a book review
regd_users.delete("/auth/deleteReview/:isbn", (req, res) => {
    isbn = req.params.isbn
    username = req.session.authorization.username
    delete books[isbn][username]
    return res.status(200).json({ message: "Review deleted" })
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
