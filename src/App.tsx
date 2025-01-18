import { useEffect, useState } from 'react'
import { ProductCatalog } from './components/ProductCatalog'
import { initDb } from './utils/db'
import './index.css'

function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDb().then(() => {
      setIsDbReady(true);
    });
  }, []);

  if (!isDbReady) {
    return <div>Initializing database...</div>;
  }

  return (
    <div className="App">
      <h1>Product Catalog</h1>
      <ProductCatalog />
    </div>
  )
}

export default App 