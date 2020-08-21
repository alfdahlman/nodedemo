const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://admin_user:m4eu1omJvCiEAe5T@cluster0.xma6r.mongodb.net/shop?retryWrites=true&w=majority', {
    useUnifiedTopology: true
  })
  .then(client => {
    _db = client.db();
    console.log('Connected to cloud');
    callback(client);
  })
  .catch(err => {
    console.log(err)
    throw  err;
  });
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw 'No database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
