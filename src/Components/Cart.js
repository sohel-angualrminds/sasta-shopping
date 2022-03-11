import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";



const Cart = () => {
    const [cartItem, setCartItem] = useState(() => localStorage.getItem('cartItem') ? JSON.parse(localStorage.getItem('cartItem')) : []);
    const [dis, setDis] = useState([]);
    const [total, setTotal] = useState();



    const setLocalStorage = () => {
        localStorage.setItem('cartCount', (cartItem.length));
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
    }

    const setChange = (e, index) => {
        let obj = cartItem[index];
        obj.qty = e.target.value;
        cartItem[index] = obj;
        setCartItem(JSON.parse(JSON.stringify(cartItem)));
        setLocalStorage();
    }

    const decrement = (index) => {
        let obj = cartItem[index];
        obj.qty = obj.qty - 1;
        cartItem[index] = obj;
        setCartItem(JSON.parse(JSON.stringify(cartItem)));
        setLocalStorage();
    }

    const increment = (index) => {
        let obj = cartItem[index];
        obj.qty = Number(obj.qty) + 1;
        cartItem[index] = obj;
        setCartItem(JSON.parse(JSON.stringify(cartItem)));
        setLocalStorage();
    }

    const RemoveItem = (e, index) => {
        let na = cartItem;
        na.splice(index, 1);
        console.log(na);
        setCartItem(JSON.parse(JSON.stringify(na)));
        setLocalStorage();
    }



    const cartItems = (arr) => {
        let arr2 = [];
        let total = 0;
        if (arr.length > 0) {
            arr2 = arr.map(({ _id, image, name, price, qty }, index) => {
                total += qty * price;
                return (
                    <div key={_id}>
                        <div className="row" >
                            <div className="col-md-3"> <img src={`http://interviewapi.ngminds.com/${image}`} width="100px" height="200px" alt={name} /></div>
                            <div className="col-md-3"> {name}
                                <br /><i className="fa fa-inr"></i>{price}
                            </div>
                            <div className="col-md-3">
                                <br />
                                <button onClick={() => decrement(index)} disabled={qty <= 1 && true}>-</button>
                                <input type='text'
                                    name='quantity'
                                    style={{ size: "5px" }}
                                    value={qty}
                                    onChange={(e) => setChange(e, index)} />
                                <button onClick={() => increment(index)} >+</button>
                            </div>
                            <div className="col-md-3">
                                <button
                                    className="btn btn-warning"
                                    onClick={(e) => RemoveItem(e, index)}
                                >
                                    remove
                                </button>
                            </div>
                        </div>
                        <hr />
                    </div>
                )
            })
        }
        setTotal(total);
        setDis(arr2);
    }


    useEffect(() => {
        cartItems(cartItem);
    }, [cartItem]);


    return (
        <div className="container">
            <div className="row">
                <h1>
                    <Link to="/home">My Ecommerce Site</Link>
                    <span className="pull-right">
                        <Link to="/cart">Cart ({localStorage.getItem('cartCount') ? localStorage.getItem('cartCount') : 0})</Link>
                    </span>
                </h1>
                <hr />
                <div className="col-md-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">MY CART ({localStorage.getItem('cartCount') ? localStorage.getItem('cartCount') : 0})
                        </div>

                        <div className="panel-body">
                            {dis}
                            <div className="row">
                                {
                                    cartItem.length > 0 ?
                                        <>
                                            <div className="col-md-9">
                                                <label className="pull-right">Amount Payable
                                                </label>
                                            </div>
                                            <div className="col-md-3 ">
                                                {total}
                                            </div>
                                        </>
                                        :
                                        <div className="col-md-7">
                                            <label className="pull-right h4">No Item Selected To order
                                            </label>
                                        </div>

                                }
                            </div>
                        </div>

                        <div className="panel-footer">
                            <Link to="/home" className="btn btn-success">Continue Shopping</Link>
                            {cartItem.length > 0 && total > 500 ?
                                <Link to="/placeorder" className="pull-right btn btn-danger">Place Order</Link>
                                :
                                <button className="pull-right btn btn-danger disabled">Place Order</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart