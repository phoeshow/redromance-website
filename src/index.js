import 'dotenv/config';
import express from 'express';
import paths from './config/paths';
import logger from 'morgan';
import createError from 'http-errors';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

const app = express();
const port = process.env.PORT;

// 设置使用模板引擎
app.set('views', paths.viewPath);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if ((process.env.NODE_ENV = 'development')) {
  app.use(express.static(paths.publicPath));

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(paths.publicPath);

  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });

  app.use(connectLivereload());
}

app.get('/', (req, res) => {
  res.render('index', { name: 'phoeshow', title: 'wow redromace' });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
