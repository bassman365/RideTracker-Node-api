'use strict';
const express =                 require('express');
const mongoose =                require('mongoose');
const bodyParser =              require('body-parser');
const rideRoutes =              require('./routes/rideRoutes');
const userRoutes =              require('./routes/userRoutes');
const authRoutes =              require('./routes/authenticateRoutes');
const programCollectionRoutes = require('./routes/programCollectionRoutes');
const Messages =                require('./common/messages');
const morgan =                  require('morgan');
const middleware =              require('./common/middleware');
const config =                  require('./config');
mongoose.Promise = global.Promise;

process.env.NODE_ENV = config.environment;

//the ride db will be created if it does not currently exist
mongoose.connect(config.database, { useMongoClient: true });
let app = express();
const port = process.env.port || 3000;

let rideRouter = rideRoutes();
let userRouter = userRoutes();
let authRouter = authRoutes();
let programCollectionRouter = programCollectionRoutes();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/authenticate', authRouter);
app.use('/api/users', userRouter);

const apiRoutes = express.Router();
apiRoutes.use(middleware.tokenIsValid);
app.use('/api', apiRoutes);
app.use('/api/rides', rideRouter);
app.use('/api/programCollections', programCollectionRouter);

app.get('/', (req, res) => {
  res.send(Messages.API_WELCOME);
});

app.listen(port, function() {
  console.log(`Running on PORT: ${port}`);
});
