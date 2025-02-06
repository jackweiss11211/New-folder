const express = require('express');
const path = require('path');
const fs = require('fs');
const { Xvideos } = require('naughty-videos');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static('public'));

//use body parser
app.use(express.urlencoded({ extended: true }));

app.post('/query', (req, res) => {
  const { query } = req.body;

  Xvideos.search(query)
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send('No results found');
      } else {
        const resultsText = data.map((result) => {
          return `${result.title}\n${result.description}\n\n`;
        }).join('');

        const filePath = path.join(__dirname, 'search_results.txt');
        fs.writeFileSync(filePath, resultsText);

        res.download(filePath, 'search_results.txt', (err) => {
          if (err) {
            res.status(500).send('Error occurred while downloading file');
          } else {
            fs.unlinkSync(filePath);
          }
        });
      }
    })
    .catch((err) => {
      console.error('Error searching:', err);
      res.status(500).send('Error occurred while searching');
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});