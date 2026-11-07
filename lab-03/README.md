# Lab 3: REST API, query parameters, validation, debugging

**Name:** Enumula Siddharth Reddy 
**Registration number:** 252U1R6064
**Section:** AIML-2B

## Overview
A REST API for managing books using Node.js, Express and SQLite (via sql.js/WebAssembly). It supports search, sorting, price filters, pagination, input validation and appropriate HTTP status codes.

## Requirements
- Node.js 18 or later
- npm
- Postman

## Installation
```bash
npm install
```

Create a `.env` file by copying `.env.example`. Do not commit `.env`.

## Run
```bash
npm start
```
Open `http://localhost:3000`.

For development:
```bash
npm run dev
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/books` | List books with search, sort, filters and pagination |
| POST | `/books` | Create a book |
| GET | `/books/:id` | Retrieve one book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

## GET /books query parameters

| Parameter | Default | Description |
|---|---|---|
| `search_q` | empty | Partial title search |
| `order_by` | `id` | Sort column (`id`, `title`, `author`, `price`, `created_at`) |
| `order` | `ASC` | Sort direction (`ASC` or `DESC`) |
| `limit` | `10` | Number of records (maximum 100) |
| `offset` | `0` | Number of records to skip |
| `min_price` | none | Minimum price |
| `max_price` | none | Maximum price |

Example:
```http
GET /books?search_q=python&min_price=200&max_price=800&order_by=price&order=DESC&limit=5&offset=0
```

## Create a book
Send JSON to `POST /books`:
```json
{
  "title": "Python Basics",
  "author": "John",
  "price": 450
}
```

## Postman test list
1. `GET http://localhost:3000/books` — expect 200.
2. `GET http://localhost:3000/books?search_q=python` — expect 200 and matching titles.
3. `GET http://localhost:3000/books?order_by=price&order=DESC` — expect descending prices.
4. `GET http://localhost:3000/books?min_price=300&max_price=700` — expect prices in range.
5. `GET http://localhost:3000/books?limit=2&offset=0` — expect at most two records.
6. `POST http://localhost:3000/books` with valid JSON — expect 201.
7. `POST http://localhost:3000/books` with missing title or invalid price — expect 400.
8. `GET http://localhost:3000/books/99999` — expect 404 if that ID does not exist.
9. `PUT http://localhost:3000/books/1` with valid JSON — expect 200 if ID 1 exists.
10. `DELETE http://localhost:3000/books/1` — expect 200 if ID 1 exists.
11. `DELETE http://localhost:3000/books/99999` — expect 404 if that ID does not exist.

## Screenshots
Save your Postman and database screenshots in `screenshots/` and embed them here, for example:
```md
![GET all books](screenshots/get-books.png)
```

## Debugging notes
- `EADDRINUSE`: another process is using the port; stop it or choose another `PORT`.
- Wrong import path: verify the relative path and filename.
- `no such table`: verify the SQLite table name is `books` and database initialization ran.
- Missing `await`: `initializeDatabase()` is awaited through `.then()` before the server starts.

## Notes
This project uses sql.js, which runs SQLite through WebAssembly and avoids compiling a native Node.js addon. SQL values use prepared statements and bound parameters. Sort columns are selected from an allowlist.

## Submission
Add your own screenshots and personal details. Never commit `.env`, passwords, or `node_modules`. Review and understand the code before submitting; be prepared to explain it in your viva.
