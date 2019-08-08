import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import api from './api';

const app = express();

app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

// Routes
app.use('/api', (req, res, next) => { console.log('here'); next(); }, api);
app.use(express.static(path.resolve(__dirname, '..', 'public', 'build')));
app.get('/*', (req, res) => {
	return res.sendFile(path.join(__dirname, '/../public/build/index.html'));
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	console.log('here1')
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.log(err)
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
