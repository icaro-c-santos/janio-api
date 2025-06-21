import express from 'express';
import { appConfig } from './config';

const run = () => {
  const app = express();
  app.get('/', (req, res) => {
    res.send('hello world 20');
  });

  app.listen(appConfig.API_PORT);
  console.log('Server listening in port ', appConfig.API_PORT);
};

run();
