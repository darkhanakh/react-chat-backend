import bcrypt from 'bcrypt';

const generatePasswordHash = (password = ''): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash: string) => {
      if (err) return reject(err);

      resolve(hash);
    });
  });

export default generatePasswordHash;
