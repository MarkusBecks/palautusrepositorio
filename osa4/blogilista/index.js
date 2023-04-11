const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())


app.listen(config.PORT, () => {
  logger.info(`Server running on ${config.PORT}`);
});