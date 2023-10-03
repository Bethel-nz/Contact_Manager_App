const dotenv = require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorHandle');
const connectDb = require('./config/dbConnection');


connectDb();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use('/api/contacts', require('./routes/contactRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use(errorHandler)

app.listen(PORT, () => console.log(`server is listening on PORT: ${PORT}`))