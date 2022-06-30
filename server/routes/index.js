// import renderPage from './page';

const router = require('express').Router();
const renderPage = require('./page');

router.use('/', renderPage);

module.exports = router;
