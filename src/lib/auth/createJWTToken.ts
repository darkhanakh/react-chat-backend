import jwt from 'jsonwebtoken';
import { reduce } from 'lodash';

interface ILoginData {
  email: string;
  password: string;
}

const createJWTToken = (user: ILoginData): string =>
  jwt.sign(
    {
      data: reduce(
        user,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: any, value, key) => {
          if (key !== 'password') {
            result[key] = value;
          }
          return result;
        },
        {},
      ),
    },
    process.env.JWT_SECRET || '',
    {
      expiresIn: process.env.JWT_MAX_AGE,
      algorithm: 'HS256',
    },
  );

export default createJWTToken;
