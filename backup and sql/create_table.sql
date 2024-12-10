CREATE Table users (
	userid		varchar(10)	NOT NULL	PRIMARY KEY, 
	name		varchar(20)	NOT NULL,
	email		text		NOT NULL	UNIQUE,
	phone		char(10)	NOT NULL	UNIQUE,
	password	text		NOT NULL,
	birthday	date,
	state		varchar(10)	NOT NULL,
	CHECK (state IN ('Available', 'Restricted', 'Admin'))
);

CREATE Table market (
	userid		varchar(10)	NOT NULL	PRIMARY KEY,
	mname		text		NOT NULL,
	maddress	text		NOT NULL,
	CONSTRAINT fk_market FOREIGN KEY (userid) REFERENCES users(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE Table product (
	productid	varchar(10)	NOT NULL	PRIMARY KEY,
	pname		text		NOT NULL,
	price		int			NOT NULL,
	sellerid	varchar(10)	NOT NULL,
	storage		int			NOT NULL,
	period		int			NOT NULL,
	state		varchar(10)	NOT NULL	DEFAULT 'Available',
	size		char(1)		NOT NULL	DEFAULT 'F',
	color		varchar(15)	NOT NULL,
	CONSTRAINT fk_seller FOREIGN KEY (sellerid) REFERENCES market(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CHECK (state IN ('Available', 'Removed', 'Sold-out', 'Restricted')),
	CHECK (size IN ('S', 'M', 'L', 'F'))
);

CREATE Table coupon (
	couponid	varchar(10)	NOT NULL	PRIMARY KEY,
	content		text		NOT NULL,
	condition	text		NOT NULL,
	start_date	date		NOT NULL,
	end_date	date		NOT NULL,
	CHECK (end_date >= start_date)
);

CREATE Table cart (
	userid		varchar(10)	NOT NULL,
	productid	varchar(10)	NOT NULL,
	quantity	int			NOT NULL	DEFAULT 1,
	PRIMARY KEY (userid, productid),
	CONSTRAINT fk_cart_user FOREIGN KEY (userid) REFERENCES users(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_product FOREIGN KEY (productid) REFERENCES product(productid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE Table orders (
	orderid		varchar(10)	NOT NULL	PRIMARY KEY,
	otime		timestamp	NOT NULL,
	buyerid		varchar(10)	NOT NULL,
	sellerid	varchar(10)	NOT NULL,
	amount		int			NOT NULL,
	method		varchar(20)	NOT NULL,
	state		varchar(20)	NOT NULL,
	review		text,
	couponid	varchar(10),
	CONSTRAINT fk_order_buyer FOREIGN KEY (buyerid) REFERENCES users(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_order_seller FOREIGN KEY (sellerid) REFERENCES market(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_order_coupon FOREIGN KEY (couponid) REFERENCES coupon(couponid)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	CHECK (state IN ('Waiting', 'Confirmed', 'Processing', 'Finished', 'CancelWaiting', 'Canceled')),
	CHECK (method IN ('Cash', 'LinePay', 'CreditCard'))
);

CREATE Table market_coupon (
	userid		varchar(10)	NOT NULL,
	couponid	varchar(10)	NOT NULL,
	quantity	int			NOT NULL,
	PRIMARY KEY(userid, couponid),
	CONSTRAINT fk_market_coupon_user FOREIGN KEY (userid) REFERENCES market(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_market_coupon_couponid FOREIGN KEY (couponid) REFERENCES coupon(couponid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE Table order_product (
	orderid		varchar(10)	NOT NULL,
	productid	varchar(10)	NOT NULL,
	quantity	int			NOT NULL	DEFAULT 1,
	PRIMARY KEY(orderid, productid),
	CONSTRAINT fk_order FOREIGN KEY (orderid) REFERENCES orders(orderid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_order_product FOREIGN KEY (productid) REFERENCES product(productid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE Table delivery (
	 orderid			varchar(10)		NOT NULL	PRIMARY KEY,
	 dmethod  			varchar(20) 	NOT NULL 	DEFAULT 	'Standard-Shipping',
	 fee   				int   			NOT NULL,
	 start_date 		date  			NOT NULL,
	 end_date 			date  			NOT NULL,
	 start_station_add 	text 			NOT NULL,
	 end_station_add  	text 			NOT NULL,
	 CONSTRAINT fk_delivery FOREIGN KEY (orderid) REFERENCES orders(orderid)
	  	ON DELETE CASCADE
	  	ON UPDATE CASCADE,
	 CHECK (dmethod IN ('Standard-Shipping', 'Express-Shipping')),
	 CHECK (end_date >= start_date)
);

CREATE Table buyer_behavior (
	userid		varchar(10)	NOT NULL,
	productid	varchar(10)	NOT NULL,
	behavior	varchar(20)	NOT NULL,
	time		timestamp	NOT NULL,
	PRIMARY KEY (userid, productid),
	CONSTRAINT fk_behavior_user FOREIGN KEY (userid) REFERENCES users(userid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_behavior_product FOREIGN KEY (productid) REFERENCES product(productid)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CHECK (behavior IN ('Favorite', 'Not-Interested', 'Browsed', 'Report'))
);