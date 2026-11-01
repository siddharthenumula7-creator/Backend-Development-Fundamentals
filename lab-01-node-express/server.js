const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to the Node.js and Express server!');
});

app.get('/about', (request, response) => {
  response.status(200).json({
    name: 'Enumula Siddharth Reddy',
    section: 'AIML-2B'
  });
});

app.get('/time', (request, response) => {
  response.status(200).json({
    currentDateTime: new Date().toString()
  });
});

// Keep this route after all valid routes.
app.use((request, response) => {
  response.status(404).send('404 - Page not found');
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
