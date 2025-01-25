import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

