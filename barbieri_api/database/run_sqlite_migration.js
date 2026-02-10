const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const migrationPath = __dirname + '/sqlite_migration.sql';
const dbPath = __dirname + '/../barbieri.sqlite';

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

const db = new sqlite3.Database(dbPath);
db.exec(migrationSQL, (err) => {
  if (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } else {
    console.log('SQLite migration completed successfully.');
    process.exit(0);
  }
});
