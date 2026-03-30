const express = require('express');

const app = express();

app.use(express.json());

app.put('/test-direct', (req, res) => {
  console.log("🔥 PUT WORKS HERE");
  res.send("PUT SUCCESS");
});

app.get('/', (req, res) => {
  res.send("TEST SERVER RUNNING");
});

app.listen(3001, () => {
  console.log("🚀 TEST SERVER RUNNING ON 3001");
});