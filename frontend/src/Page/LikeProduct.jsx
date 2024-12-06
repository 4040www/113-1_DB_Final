
export default function LikeProduct({ }) {
    const status1 = "delivering"; // Exampl</div>e status, you can replace it with your actual status logic
    const status2 = "Checking"; // Example status, you can replace it with your actual status logic

    return (
        <div className="">
            <h1>Like Product</h1>
            <div className='YourOrderCard'>
                <div className="YourOrderCard-content">
                    <div className="YourOrderCard-info">
                        <h3>MarketName $3000</h3>
                        <div>Status : {status1}</div>
                        <div>Purchase Date : 2024 / 10 / 25</div>

                        <div className='YourOrderCard-content-button'>
                            <button>{status1 !== "Checking" ? "Refund" : "Cancel"}</button>
                            <button>Feedback</button>
                        </div>
                    </div>
                    <div className='YourProductCardinOrder'>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                    </div>
                </div>
                <div className="YourOrderCard-content">
                    <div className="YourOrderCard-info">
                        <h3>MarketName $3000</h3>
                        <div>Status : {status1}</div>
                        <div>Purchase Date : 2024 / 10 / 25</div>

                        <div className='YourOrderCard-content-button'>
                            <button>{status1 !== "Checking" ? "Refund" : "Cancel"}</button>
                            <button>Feedback</button>
                        </div>
                    </div>
                    <div className='YourProductCardinOrder'>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                    </div>
                </div>
                <div className="YourOrderCard-content">
                    <div className="YourOrderCard-info">
                        <h3>MarketName $3000</h3>
                        <div>Status : {status2}</div>
                        <div>Purchase Date : 2024 / 10 / 25</div>

                        <div className='YourOrderCard-content-button'>
                            <button>{status2 !== "Checking" ? "Refund" : "Cancel"}</button>
                            <button>Feedback</button>
                        </div>
                    </div>
                    <div className='YourProductCardinOrder'>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                        <div className="YourProductCardinOrder-content">
                            <h3>Apple $30</h3>
                            <div>Amount : 20</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}