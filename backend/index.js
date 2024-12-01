const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
const Hospital = require('./models/Admin'); // Correct import pat

app.use(bodyParser.json()); // req.body


const port = process.env.PORT || 3000;
app.use(cors());

const adminRoutes = require('./routes/adminroutes')



app.use('/Admin', adminRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(port, () => {
  console.log(port);
})