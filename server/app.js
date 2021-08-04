module.exports = {}

const express = require('express');
const cors = require('cors');
const path = require('path');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const _handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


const mongoose = require('mongoose');
const dotenv = require('dotenv');

const result = dotenv.config();


   mongoose.connect(
      process.env.ATLAS_CONNECTION_STRING,
      {useNewUrlParser: true, useUnifiedTopology: true}
   );

mongoose.Promise = global.Promise;
const db = mongoose.connection;

mongoose.connection.on('connected', () => {
   console.log(`Connected to MongoDB`);
});

mongoose.connection.on('error', function (err) {
   console.log('error', 'Error Connecting to Atlas', err);
});




// throw new Error ('Oops')
// Init App
const app = express();

app.use(cors());

//*May use View Engine for some basic views / info
// View Engine
app.set('views', path.join(`${__dirname}/views`));
app.engine(
   '.hbs',
   exphbs({
      defaultLayout: 'main',
      layoutsDir: `${__dirname}/views/layouts`,
      partialsDir: `${__dirname}/views/partials`,
      handlebars: allowInsecurePrototypeAccess(_handlebars),
      extname: '.hbs'
   })
);
app.set('view engine', '.hbs');

// BodyParser Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
// app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', require('./routes.js'));

// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
   console.log('info', `Server started on ${app.get('port')}`);
});

console.log('env sync server', process.env.SYNC_SERVER);