const { MongoClient, GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const getGridFSBucket = async () => {
  const db = mongoose.connection.db; // Use the mongoose connection db
  return new GridFSBucket(db, {
    bucketName: 'research_papers', // You can customize the bucket name
  });
};

module.exports = getGridFSBucket;
