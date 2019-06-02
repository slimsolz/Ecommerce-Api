import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import index from './routes';

const app = express();

// API Docs
const swaggerDocument = YAML.load(`${process.cwd()}/server/swagger.yaml`);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;
app.set('port', port);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', index);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

export default app;
