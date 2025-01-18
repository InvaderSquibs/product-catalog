import initSqlJs from 'sql.js';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 2
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

let db: any = null;

export const initDb = async () => {
  console.log('Initializing database...');
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  db = new SQL.Database();
  
  // Initialize the database
  console.log('Creating table if not exists...');
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      imageUrl TEXT NOT NULL
    )
  `);

  // Check if we need to seed the database
  const result = db.exec('SELECT COUNT(*) as count FROM products');
  const count = result[0].values[0][0];
  console.log('Current product count:', count);

  if (count === 0) {
    console.log('Seeding database...');
    db.run('BEGIN TRANSACTION');
    
    for (let i = 0; i < 100; i++) {
      db.run(`
        INSERT INTO products (name, description, price, imageUrl)
        VALUES (?, ?, ?, ?)
      `, [
        `Product ${i + 1}`,
        lorem.generateParagraphs(1),
        Math.floor(Math.random() * 10000) / 100,
        `https://picsum.photos/seed/${i + 1}/200/200`
      ]);
    }
    
    db.run('COMMIT');
    console.log('Database seeded successfully');
  }

  return db;
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}; 