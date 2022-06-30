const router = require('express').Router();
const pageRender = require('../controller/page');

router.get('/', pageRender.renderHomePage);

module.exports = router;
