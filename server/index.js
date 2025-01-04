import app from './app.js';

// Start the server
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`the app listening on ${PORT} port`);
});
