// Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// Find books published after a certain year
db.books.find({ published_year: { $gt: 1955 } });

// Find books by a specific author
db.books.find({ author: "George Orwell" });

// Update the price of a specific book
db.books.updateOne({ title: "The Alchemist" }, { $set: { price: 8.5 } });

// Delete a book by its title
db.books.deleteOne({ title: "1984" });

// Find books that are in stock and published after 2010
db.books.find({ $and: [{ in_stock: true }, { pages: 336 }] });

// Use projection
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// Sorting
db.books.find().sort({ price: 1 }); // ascending
db.books.find().sort({ price: -1 }); // descending

// Pagination (page 1)
db.books.find().limit(5);

// Find the cheapest book
db.books.find().sort({ price: 1 }).limit(1);

// Pagination (page 2)
db.books.find().skip(5).limit(5);

// Aggregation examples

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } },
]);

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 },
]);

// Group books by publication decade
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
      count: 1,
      _id: 0,
    },
  },
]);

// INDEXING

// Index on title
db.books.createIndex({ title: 1 });

// Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain to show performance
db.books.find({ title: "Pride and Prejudice" }).explain("romance");
