const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../src/v1/models/user'); // Assuming path to your Mongoose User model
const PROTO_PATH = "./tokenhandler.proto";



async function DecodeTokenGrpc(call, callback) {
  const token = call.request.token;
  const bearer = token.split(' ')[1];
  if (bearer ) {
    try {
      const tokenDecoded = jsonwebtoken.verify(bearer,'ockas@SSSNAC$1231');
      console.log(tokenDecoded)
      id=tokenDecoded.id
      callback(null, { id});
    } catch (error) {
      console.error('Error decoding token:', error.message);
      callback(new Error('Internal server error'), null);
    }
  } else {
    callback(new Error('Token not found'), null);
  }
}

const startServer = () => {
  const server = new grpc.Server();


  var serviceDef = protoLoader.loadSync(PROTO_PATH);
  var tokenDecoder = grpc.loadPackageDefinition(serviceDef).observer;

  server.addService(tokenDecoder.DecodeToken.service, { DecodeTokenGrpc : DecodeTokenGrpc });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
      server.start();
  });
}
startServer();