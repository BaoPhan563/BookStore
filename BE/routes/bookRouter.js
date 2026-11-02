const express = require("express");
const bodyParser = require("body-parser");
const Books = require("../models/book");
const authenticate = require("../loaders/authenticate");
const Inventory = require("../models/inventory");
const cors = require("../loaders/cors");
const Order = require("../models/order");

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

//set true false for book
bookRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/:bookId/set", cors.cors, async (req, res, next) => {
    try{ 
      const { query } = req.query;
      const book = await Books.findById(req.params.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      console.log(query);
      console.log(book);
      if (query === "true") {
        book.status = true;
      } else if (query === "false") {
        book.status = false;
      } else {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      await book.save();
      res.status(200).json(book);
    }catch(err){
      next(err);
    }
  });

bookRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/search", cors.cors, async (req, res, next) => {
    try {
      const { title } = req.query;

      if (!title) {
        return res
          .status(400)
          .json({ message: "Title query parameter is required" });
      }

      // Perform the search
      const books = await Books.find({
        title: { $regex: title, $options: "i" },
      });

      res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  });

//list all genre
bookRouter
  .route("/allgenre")
  //option method is used to check if the server allows the request
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    //cors.cors is a middleware to check if the request is allowed
    //find all genres
    Books.find({})
      .distinct("genre")
      .then(
        (genres) => {
          res.json(genres);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });
bookRouter
  .route("/genre/:genre")
  .options(cors.corsWithOptions, (req, res) => {
    //option method is used to check if the server allows the request
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    //find all books by genre
    Books.find({ genre: req.params.genre })
      .populate("comments.author", "fullname _id")
      .populate("imageurls.imageUrl")
      .then(
        (books) => {
          if (books.length == 0) {
            res.json({ message: "No books found" });
          } else {
            res.json(books);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });

//list all author
bookRouter
  .route("/allauthor")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    //find all authors
    Books.find({})
      .distinct("author")
      .then(
        (authors) => {
          res.json(authors);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });
//sort book by author
bookRouter
  .route("/author/:author")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    //find all books by author
    Books.find({ author: req.params.author })
      .populate("comments.author", "fullname _id")
      .populate("imageurls.imageUrl")
      .then(
        (books) => {
          if (books.length == 0) {
            res.json({ message: "No books found" });
          } else {
            res.json(books);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });
//sort by price
bookRouter
  .route("/price/from:min/to:max")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    //find all books by price
    const min = Number(req.params.min) || 0;
    const max = Number(req.params.max) || Number.MAX_SAFE_INTEGER;
    Books.find({ price: { $gte: min, $lte: max } })
      .populate("comments.author", "fullname _id")
      .populate("imageurls.imageUrl")
      .then(
        (books) => {
          res.json(books || []);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });
  bookRouter.route('/rating/:min')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
      const min = Number(req.params.min) || 0;
      Books.find({ total_rating: { $gte: min, $lte: 5 } })
          .populate('comments.author', 'fullname _id')
          .populate('imageurls.imageUrl')
          .then(
              (books) => {
                  res.json(books || []);
              },
              (err) => next(err)
          )
          .catch((err) => next(err));
  });


//All books
bookRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Books.find({})
      .populate("comments.author", "fullname _id")
      .populate("imageurls.imageUrl")
      .then(
        (books) => {
          res.json(books || []);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Books.findOne({ title: req.body.title })
        .then((book) => {
          if (book) {
            // If a book with the same title already exists, send an error response
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json({ error: "A book with the same title already exists." });
          } else {
            // If no book with the same title exists, create a new book
            return Books.create(req.body)
              .then((book) => {
                console.log("Book Created ", book);
                return Inventory.create({
                  book: book._id,
                  quantity: req.body.quantity,
                  transaction_type: "Addition",
                }).then(() => book); // Return the book after creating the inventory
              })
              .then((book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              });
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /books");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Books.deleteMany({})
        .then(
          (resp) => {
            console.log("Books removed");
            res.json({ message: "Deleted successfully!" }); // return the response
          },
          (err) => next(err) // pass the error to the error handler
        )
        .catch((err) => {
          next(err); // pass the error to the error handler
        });
    }
  );

// Detail of a book
bookRouter
  .route("/:bookId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments.author", "fullname _id")
      .populate("imageurls.imageUrl")
      .then(
        (book) => {
          if (book == null) {
            res.json({ message: "No book found" });
          } else {
            res.json(book);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("POST operation not supported on /books/" + req.params.bookId);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      //nhập thêm số lượng sách
      Books.findById(req.params.bookId)
        .then(
          async (book) => {
            if (book != null) {
              await Inventory.create({
                book: req.params.bookId,
                quantity: req.body.quantity,
                transaction_type: "Addition",
                description: "Increase stock",
              });
              book.quantity += req.body.quantity;
              book.price = req.body.price;
              book.description = req.body.description;
              book.save().then(
                (book) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(book);
                },
                (err) => next(err)
              );
            } else {
              err = new Error("Book " + req.params.bookId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => {
          next(err);
        });
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Books.findByIdAndDelete(req.params.bookId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "Deleted successfully" });
          },
          (err) => next(err)
        )
        .catch((err) => {
          next(err);
        });
    }
  );

//Comments
bookRouter
  .route("/:bookId/comments")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments.author", "fullname _id")
      .then(
        (book) => {
          if (book != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            if (book.comments.length == 0) {
              res.json({ message: "No comments found" });
            } else {
              res.json(book.comments);
            }
          } else {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const book = await Books.findById(req.params.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book " + req.params.bookId + " not found" });
      }

      // Check if user has ordered the book in a successful order
      const order = await Order.findOne({
        user: req.user._id,
        order_status: "Success",
        "order_details.book": req.params.bookId,
      });

      if (!order && !req.user.admin) {
        return res.status(403).json({ message: "You have not ordered this book" });
      }

      // Check if user already commented
      const alreadyCommented = book.comments.some(
        (c) => c.author && c.author.toString() === req.user._id.toString()
      );
      if (alreadyCommented) {
        return res.status(403).json({ message: "You have already commented" });
      }

      const newComment = {
        rating: Number(req.body.rating) || 5,
        comment: req.body.comment,
        author: req.user._id,
      };

      book.comments.push(newComment);

      const total = book.comments.reduce((sum, c) => sum + (c.rating || 0), 0);
      book.total_rating = total / book.comments.length;

      await book.save();

      const populatedBook = await Books.findById(book._id).populate(
        "comments.author",
        "fullname _id"
      );

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(populatedBook);
    } catch (err) {
      next(err);
    }
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /books/" + req.params.bookId + "/comments"
    );
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Books.findById(req.params.bookId)
        .then(
          (book) => {
            if (book != null) {
              for (var i = book.comments.length - 1; i >= 0; i--) {
                book.comments.id(book.comments[i]._id).deleteOne();
              }
              book.save().then(
                (book) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(book);
                },
                (err) => next(err)
              );
            } else {
              err = new Error("Book " + req.params.bookId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

  
//Comment by ID
bookRouter
  .route("/:bookId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments.author", "fullname _id")
      .then(
        (book) => {
          if (book != null && book.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book.comments.id(req.params.commentId));
          } else if (book == null) {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /books/" +
        req.params.bookId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyAdmin,
    authenticate.verifyUser,
    (req, res, next) => {
      Books.findById(req.params.bookId)
        .then(
          (book) => {
            if (
              book != null &&
              book.comments.id(req.params.commentId) != null
            ) {
              if (req.body.comment) {
                book.comments.id(req.params.commentId).comment =
                  req.body.comment;
              }
              book.save().then(
                (book) => {
                  Books.findById(book._id)
                    .populate("comments.author", "fullname _id")
                    .then((book) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(book);
                    });
                },
                (err) => next(err)
              );
            } else if (book == null) {
              err = new Error("Book " + req.params.bookId + " not found");
              err.status = 404;
              return next(err);
            } else {
              err = new Error("Comment " + req.params.commentId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyAdmin,
    authenticate.verifyUser,
    (req, res, next) => {
      Books.findById(req.params.bookId)
        .then(
          (book) => {
            if (
              book != null &&
              book.comments.id(req.params.commentId) != null
            ) {
              book.comments.id(req.params.commentId).deleteOne();
              book.save().then(
                (book) => {
                  Books.findById(book._id)
                    .populate("comments.author", "fullname _id")
                    .then((book) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(book);
                    });
                },
                (err) => next(err)
              );
            } else if (book == null) {
              err = new Error("Book " + req.params.bookId + " not found");
              err.status = 404;
              return next(err);
            } else {
              err = new Error("Comment " + req.params.commentId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = bookRouter;
