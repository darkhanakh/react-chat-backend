import jwt from 'jsonwebtoken';

const verifyJWTToken = (token: string): Promise<unknown> =>
  new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET || '', (e, decodedToken) => {
      if (e || !decodedToken) {
        return rej(e);
      }

      res(decodedToken);
    });
  });

export default verifyJWTToken;
