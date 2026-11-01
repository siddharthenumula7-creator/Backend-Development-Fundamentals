const express = require("express");
const initializeDB = require("./database");

const app = express();
app.use(express.json());

let db;

// GET all books
app.get("/books/", async (request, response) => {
  try {
    const books = await db.all("SELECT * FROM book;");
    response.status(200).send(books);
  } catch (error) {
    response.status(500).send({ error: "Unable to retrieve books" });
  }
});

// GET one book
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const book = await db.get("SELECT * FROM book WHERE id = ?;", [bookId]);

    if (!book) {
      return response.status(404).send({ error: "Book Not Found" });
    }
    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({ error: "Unable to retrieve book" });
  }
});

// POST a new book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !Number.isInteger(price) || price < 0 ||
      !Number.isInteger(pages) || pages < 1
    ) {
      return response.status(400).send({
        error: "Provide title, author, a non-negative integer price, and a positive integer pages value.",
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?);`,
      [title.trim(), author.trim(), price, pages]
    );

    response.status(201).send({
      message: "Book Added Successfully",
      bookId: result.lastID,
    });
  } catch (error) {
    response.status(500).send({ error: "Unable to add book" });
  }
});

// PUT (replace book details)
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !Number.isInteger(price) || price < 0 ||
      !Number.isInteger(pages) || pages < 1
    ) {
      return response.status(400).send({
        error: "Provide title, author, a non-negative integer price, and a positive integer pages value.",
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?;`,
      [title.trim(), author.trim(), price, pages, bookId]
    );

    if (result.changes === 0) {
      return response.status(404).send({ error: "Book Not Found" });
    }
    response.status(200).send({ message: "Book Updated Successfully" });
  } catch (error) {
    response.status(500).send({ error: "Unable to update book" });
  }
});

// DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const result = await db.run("DELETE FROM book WHERE id = ?;", [bookId]);

    if (result.changes === 0) {
      return response.status(404).send({ error: "Book Not Found" });
    }
    response.status(200).send({ message: "Book Deleted Successfully" });
  } catch (error) {
    response.status(500).send({ error: "Unable to delete book" });
  }
});

// Open the database before starting the server
const initializeDBAndServer = async () => {
  try {
    db = await initializeDB();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
