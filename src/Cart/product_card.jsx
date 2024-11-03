
export default function product_card({ product }) {
    return (
        <div className="flex-column">
            <div className="flex">
                <div className="product_card_index">
                    <h3>{product.id}</h3>
                </div>
                <div className="product_card">
                    <h2>{product.pname}</h2>
                    <h3>${product.price}</h3>
                </div>


                <button className="product-card-button">Like♡</button>
                <button className="product-card-button">Add to Cart</button>
            </div>
            <div className="product_card2">
                <p>remain:{product.storage} / cooling-off period:{product.period}</p>
            </div>
        </div>
    );
}
