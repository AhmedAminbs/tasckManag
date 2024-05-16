const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'C:/Users/AMIN/Desktop/TaskManagement/server/GrpcAuth/tokenhandler.proto';
const User = require('../models/user')

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const tokenDecoder = grpc.loadPackageDefinition(packageDefinition).observer;

// Create a gRPC client
const client = new tokenDecoder.DecodeToken('localhost:50051', grpc.credentials.createInsecure());

const tokenDecode = (req) => {
  return new Promise((resolve, reject) => {
    const token = req.headers['authorization'];
    client.DecodeTokenGrpc({ token }, (error, response) => {
      if (error) {
        console.log('Error decoding token:', error);
        reject(error);
      } else {
        console.log('Token decoded:', response);
        resolve(response);
      }
    });
  });
};



exports.verifyToken = async (req, res, next) => {
  try {
    const tokenDecoded = await tokenDecode(req);
    console.log('Decoded token:', tokenDecoded);

    if (tokenDecoded) {
      const user = await User.findById(tokenDecoded.id);
      if (!user) {
        console.log('User not found');
        return res.status(401).json('Unauthorized');
      }

      req.user = user;
      next();
    } else {
      console.log('Token not decoded');
      res.status(401).json('Unauthorized');
    }
  } catch (error) {
    console.log('Error verifying token:', error);
    res.status(500).json('Internal Server Error');
  }
};