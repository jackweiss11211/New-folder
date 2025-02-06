const express = require('express');
const path = require('path');
const fs = require('fs');
const xvdl = require('xvdl');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static('public'));

//use body parser
app.use(express.urlencoded({ extended: true }));

app.post('/query', (req, res) => {
  const { query } = req.body;

  xvdl.search(query, (err, results) => {
    if (err) {
      console.error('Error searching:', err);
      res.status(500).send('Error occurred while searching');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('No results found');
      return;
    }

    const videoId = results[0].id;
    xvdl.download(videoId, (err, filePath) => {
      if (err) {
        console.error('Error downloading:', err);
        res.status(500).send('Error occurred while downloading');
        return;
      }

      res.download(filePath, 'video.mp4', (err) => {
        if (err) {
          res.status(500).send('Error occurred while downloading file');
        } else {
          fs.unlinkSync(filePath);
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
