import { Client } from 'pg';
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from '../config/app.config';

export const client = new Client({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
});