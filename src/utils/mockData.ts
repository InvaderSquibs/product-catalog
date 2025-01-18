import { Product } from '../types';
import { getDb } from './db';

const INITIAL_PAGE_SIZE = 30;
const PAGE_SIZE = 10;

export const fetchProductPage = async (
  page: number,
  searchTerm: string = ''
): Promise<{ 
  data: Product[], 
  hasMore: boolean 
}> => {
  console.log('Fetching page:', page, 'with search:', searchTerm);

  // Simulate slow network with 3 second delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Randomly fail about 1/3 of the time
  if (Math.random() < 0.33) {
    throw new Error('Failed to fetch products. Please try again.');
  }

  try {
    const db = getDb();
    
    // Build the query based on search term
    let whereClause = '';
    let params: any[] = [];
    
    if (searchTerm) {
      whereClause = 'WHERE name LIKE ? OR description LIKE ?';
      params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    // Get total count for pagination
    const countResult = db.exec(`
      SELECT COUNT(*) as count 
      FROM products 
      ${whereClause}
    `, params);
    const count = countResult[0].values[0][0] as number;
    console.log('Total count:', count);

    // Get paginated results
    const offset = (page - 1) * (page === 1 ? INITIAL_PAGE_SIZE : PAGE_SIZE);
    const limit = page === 1 ? INITIAL_PAGE_SIZE : PAGE_SIZE;
    const results = db.exec(`
      SELECT * 
      FROM products 
      ${whereClause}
      ORDER BY id 
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const products: Product[] = results[0]?.values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      description: row[2],
      price: row[3],
      imageUrl: row[4]
    })) || [];

    console.log('Fetched products:', products.length);

    return {
      data: products,
      hasMore: offset + products.length < count
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch products from database');
  }
}; 