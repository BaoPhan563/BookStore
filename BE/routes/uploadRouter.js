const express = require("express");
const bodyParser = require("body-parser");
const Books = require("../models/book");
const authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const multer = require("multer");
const cloudinary = require("../configs/cloudinaryConfig");
const dotenv = require("dotenv");
dotenv.config();

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload image to Cloudinary and return secure URL
function uploadImageToStorage(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bookstore",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(file.buffer);
  });
}

uploadRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/many/:bookId")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.array("image", 4), //upload nhieu file anh voi key la image
    async (req, res, next) => {
      try {
        const imageUrls = []; //tao mang chua cac url cua anh sau khi upload len firebase storage
        for (const file of req.files) {
          //duyet qua cac file anh
          const imageUrl = await uploadImageToStorage(file);
          imageUrls.push({ book: req.params.bookId, imageUrl });
        } //upload anh len firebase storage va lay url cua anh

        const book = await Books.findById(req.params.bookId); //tim book co id la bookId
        if (!book) {
          let err = new Error(`Book ${req.params.bookId} not found`);
          err.status = 404;
          return next(err);
        }
        if (book.imageurls.length >= 4) {
          // nếu sách đã có đủ 4 ảnh
          let err = new Error("Book already has 4 images");
          err.status = 400;
          return next(err);
        }

        // imageUrls.forEach((imageUrl) => {
        //   book.imageurls.push(imageUrl);
        // });
        book.imageurls.push(...imageUrls); //them cac url cua anh vao book
        const savedBook = await book.save(); //luu lai book sau khi them imageurls
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(savedBook.imageurls);
      } catch (err) {
        next(err);
      }
    }
  );

uploadRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/:bookId")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin, //chi admin moi co quyen upload
    upload.single("image"), //upload 1 file anh voi key la image
    async (req, res, next) => {
      try {
        const imageUrl = await uploadImageToStorage(req.file); //upload anh len firebase storage va lay url cua anh

        const book = await Books.findById(req.params.bookId); //tim book co id la bookId
        if (!book) {
          let err = new Error(`Book ${req.params.bookId} not found`);
          err.status = 404;
          return next(err);
        }

        if (book.imageurls.length >= 4) {
          // nếu sách đã có đủ 4 ảnh
          let err = new Error("Book already has 4 images");
          err.status = 400;
          return next(err);
        }

        // imageUrls.forEach((imageUrl) => {
        //   book.imageurls.push(imageUrl);
        // });
        book.imageurls.push({ book: req.params.bookId, imageUrl }); //them cac url cua anh vao book
        const savedBook = await book.save(); //luu lai book sau khi them imageurls
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(savedBook.imageurls);
      } catch (err) {
        next(err);
      }
    }
  );

uploadRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/:bookId/:imageId")
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Books.findById(req.params.bookId) //tim book co id la bookId
        .then((book) => {
          if (book) {
            const image = book.imageurls.id(req.params.imageId); //tim image co id la imageId
            if (image) {
              book.imageurls.id(req.params.imageId).deleteOne();
              book
                .save()
                .then(() => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ message: "Image deleted successfully" });
                })
                .catch((err) => next(err));
            } else {
              err = new Error(`Image ${req.params.imageId} not found`);
              err.status = 404;
              return next(err);
            }
          } else {
            err = new Error(`Book ${req.params.bookId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

uploadRouter
  .route("/:bookId/setDefault/:imgId")
  .get(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      try {
        const book = await Books.findById(req.params.bookId);
        if (!book) {
          let err = new Error(`Book ${req.params.bookId} not found`);
          err.status = 404;
          return next(err);
        }

        // Reset all images to not be default
        book.imageurls.forEach((image) => {
          image.defaultImg = false;
        });

        const image = book.imageurls.id(req.params.imgId);
        if (!image) {
          let err = new Error(`Image ${req.params.imgId} not found`);
          err.status = 404;
          return next(err);
        }

        image.defaultImg = true;
        await book.save(); // Save the entire book object to update the default image

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(book.imageurls);
      } catch (err) {
        next(err);
      }
    }
  );

module.exports = uploadRouter;
