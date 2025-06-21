import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/joke', async (req, res) => {
  const firstName = req.body.firstName || "John";
  const lastName = req.body.lastName || "Doe";

  try {
    const jokeUrl = `https://v2.jokeapi.dev/joke/Any?type=single&blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt&amount=1`;
    const jokeResponse = await axios.get(jokeUrl);
    let joke = jokeResponse.data;

    const personalizedJoke = joke.replace(/Chuck Norris|John Doe/gi, `${firstName} ${lastName}`);

    res.render('result', {
      name: `${firstName} ${lastName}`,
      joke: personalizedJoke,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('result', {
      error: 'Could not get a joke. Try again!',
      name: '',
      joke: ''
    });
  }
});

app.listen(PORT, () => {
  const interfaces = os.networkInterfaces();
  Object.entries(interfaces).forEach(([name, iface]) => {
    iface.forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        console.log(`Accessible at http://${details.address}:${PORT}`);
      }
    });
  });
  console.log(`Server running at http://localhost:${PORT}`);
});