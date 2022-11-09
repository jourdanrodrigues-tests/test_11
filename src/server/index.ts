require('dotenv').config();

import express from 'express';
import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));
