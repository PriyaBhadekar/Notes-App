const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://saniyahakim22:MIFNY0otBoR40WGi@test-pro-db.k4zb7.mongodb.net/noteApp?retryWrites=true&w=majority';

async function testConnection() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    const databasesList = await client.db().admin().listDatabases();
    console.log('Databases:', databasesList.databases.map(db => db.name));
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();