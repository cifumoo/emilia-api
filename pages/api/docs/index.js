// pages/api/swagger.js

import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'swagger.json');
  const jsonContent = await fs.readFile(filePath, 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(jsonContent);
}