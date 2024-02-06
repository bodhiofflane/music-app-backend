export const APPPORT = process.env.APPORT || 5000;

export const PGUSER =  process.env.PGUSER || 'postgres';
export const PGPASSWORD = process.env.PGPASSWORD || '231288';
export const PGHOST = process.env.PGHOST || 'localhost';
export const PGPORT = Number.parseInt(process.env.PGPORT as string) || 5432;
export const PGDATABASE = process.env.PGDATABASE || 'music_app';