// import jwt from 'jsonwebtoken';
// import {UserModel, UserStatus} from '../models/userModel.js';

// export default async (req, res, next) => {

//     const authHeader =  req?.headers;

//     const authorization = authHeader?.authorization;

//     if (!authorization || !authorization.startsWith('Bearer ')) {
//         return res.status(401).json({ message: "Missing or invalid token format" });
//     };

//     const token = authorization.split(" ")[1]; // safer than slice

//     if(!token) return res.sendStatus(401);

//     try {
//         console.log("Authorization header:", authorization);
//         console.log("Extracted token:", token);

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const account = await UserModel.findById(decoded?.id).select("+password");

//         if(!account) return res.sendStatus(401)

//         if(account.status == UserStatus.SUSPENDED) return res.sendStatus(403);

//         if(account.status == UserStatus.DELETED) return res.sendStatus(404);

//         req['user'] = account;

//         next();

//     } catch (error) {
//         return res.sendStatus(401);
//     }
    
// }

import jwt from 'jsonwebtoken';
import { UserModel, UserStatus } from '../models/userModel.js';

export default async (req, res, next) => {
  const authHeader = req?.headers;
  const authorization = authHeader?.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token not found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await UserModel.findById(decoded?.id).select("+password");

    if (!account) return res.status(401).json({ message: "Account not found" });

    if (account.status === UserStatus.SUSPENDED)
      return res.status(403).json({ message: "Account suspended" });

    if (account.status === UserStatus.DELETED)
      return res.status(404).json({ message: "Account deleted" });

    req.user = account;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
