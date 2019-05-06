const express = require('express');
const helmet = require('helmet');

const zooRouter = require('./zoos/zoo-router.js');
const bearRouter = require('./zoos/bear-router.js');
const giraffeRouter = require('./zoos/giraffe-router');

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/zoos', zooRouter);
server.use('/api/bears', bearRouter);
server.use('/api/giraffes', giraffeRouter);

module.exports = server;