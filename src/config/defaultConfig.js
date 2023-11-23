import 'dotenv/config'

const defaultConfig = {
  port: `${process.env.PORT_DEV}`,
  mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@animebinarystore.wxacw8l.mongodb.net/?retryWrites=true&w=majority`,
  mongoCapURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@animebinarystore.wxacw8l.mongodb.net/capBinary?retryWrites=true&w=majority`
}

export default defaultConfig
