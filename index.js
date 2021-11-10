const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }));


// 무한 스크롤 크롤링
const intiniteScroll = require('./InfiniteScroll');
// const crawling = require('./Crawaling');


const port = 5000;
app.listen(port, () => {
  console.log(`${port} on server start`);
})