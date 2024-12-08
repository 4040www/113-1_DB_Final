import '../Card.css';

export default function RecProductCard({ products }) {


    const handleAddToCart = async (productId) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(
                `http://localhost:${window.globalPort}/add_to_cart?userid=${userId}&productid=${productId}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Failed to add to cart');
            alert('Product added to cart');
        } catch (err) {
            console.error(err.message);
            alert('Failed to add to cart');
        }
    };

    return (
        <div className='RecCard'>
            {products.map((product, index) => (
                <div className="RecCard-content" key={index}>
                    <h3>{product.pname}</h3>
                    <div>{product.store}</div>
                    <div>{product.price} / {product.color} / {product.size}</div>
                    <button onClick={() => handleAddToCart(product.productid)}>
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
