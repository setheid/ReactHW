'use strict';

let express = require('express');
let server = express();

server.use(express.static(`${__dirname}/build`)).listen(9000, err => {
  if (err) return console.log(err);
  console.log('server up on 9000');
});
