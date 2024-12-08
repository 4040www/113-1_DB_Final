import '../Card.css';

export default function YourProductCard({product_data, fetchProductData, setProduct}) {

  const truncate = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const deleteHandler = async (productid) => {
    try {
      const response = await fetch(`http://localhost:${window.globalPort}/delete_product?productid=${productid}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      const data = await response.json();
      if (data.status === 'success') {
        console.log('Product deleted:', productid);
        alert('Product deleted successfully!');
        setProduct(product_data.filter((item) => item.id !== productid));
        fetchProductData();
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Failed to delete product');
    }
  }

  return (
    <div className='MarketCard'>
      <h2>Your Product</h2>
      <div className='YourProductCard'>
        {product_data.map((product) => (
          <div key={product.id} className="YourProductCard-content">
            <h3 title={product.pname} style={{ cursor: 'pointer' }}>
              {truncate(product.pname,10)} ${product.price}
            </h3>
            <div>Color: {product.color}</div>
            <div>Size: {product.size}</div>
            <div>Refund Period: {product.period} days</div>
            <div className='YourProductCard-content-button'>
              <button
                onClick={() => deleteHandler(product.productid)}
              >Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
