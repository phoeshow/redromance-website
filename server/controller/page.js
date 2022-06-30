const renderHomePage = async (req, res) => {
  res.locals.pageName = 'home';
  res.render('index');
};

const renderSigninPage = async (req, res) => {
  res.locals.pageName = 'signin';

  res.render('signin');
};

module.exports = { renderHomePage, renderSigninPage };
