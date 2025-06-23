import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { appConfig } from './config';
import swaggerDocument from '../docs/swagger.json';

const run = () => {
  const app = express();
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    res.send('hello world 20');
  });

  app.listen(appConfig.API_PORT);
  console.log('Server listening in port ', appConfig.API_PORT);
};

run();
