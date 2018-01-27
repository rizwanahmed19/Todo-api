const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Todo API root');
});

app.listen(PORT, () => {
  console.log('App is up on port', PORT);
});