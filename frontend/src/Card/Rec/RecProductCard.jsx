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

    const truncate = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };


    return (
        <div className='RecCard'>
            {products.map((product, index) => (
                <div className="RecCard-content" key={index} style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <h3 title={product.pname} style={{ cursor: 'pointer' }} >{truncate(product.pname,20)}</h3>
                    <div>{product.store}</div>
                    <div>PRICE : ${product.price} </div>
                    <div>COLOR : {product.color}</div>
                    <div>SIZE : {product.size}</div>
                    <button onClick={() => handleAddToCart(product.productid)}
                        style={{ padding: '5px 10px', width:'180px', marginTop:'30px', alignSelf:'center', fontWeight:'bold', }}
                        >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
