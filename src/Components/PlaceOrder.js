import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postOrder } from '../Service/Service'

const PlaceOrder = () => {
    let location = useNavigate();
    const [dis, setDis] = useState([]);
    const [total, setTotal] = useState();
    const [totalItem, setTotalItem] = useState();
    const [userInfo, setUserInfo] = useState({});
    const [error, setError] = useState({});

    const cartItems = (arr) => {
        let arr2 = [];
        let total = 0;
        let Totalqty = 0;
        if (arr.length > 0) {
            arr2 = arr.map(({ _id, name, price, qty }) => {
                total += qty * price;
                Totalqty++;
                return (
                    <tr key={_id}>
                        <td>{name} </td>
                        <td>{qty}</td>
                        <td><i className="fa fa-inr"></i>{qty * price}</td>
                    </tr>
                )
            })
        }
        setTotal(total);
        setTotalItem(Totalqty);
        setDis(arr2);
    }

    const onChangeInfo = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        if (!userInfo || !userInfo.userName || !userInfo.address) {
            setError({ success: false, msg: "UserInfo Required !" })
            toast.error('UserInfo Required !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return;
        }
        else {
            let arr = localStorage.getItem('cartItem') ? JSON.parse(localStorage.getItem('cartItem')) : []

            let obj = {
                personName: userInfo.userName,
                deliveryAddress: userInfo.address,
                productsOrdered: arr.map(({ _id, qty, price }) => { return { productID: _id, qty: qty, price: price, total: qty * price } }),
                orderTotal: total
            };

            const res = await postOrder('placeOrder', obj);
            if (res.status === 200) {
                toast.success('Order Confirmed', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                });
                setUserInfo({});
                setTimeout(function () {
                    location('/home');
                }, 2000);

            }
            else {
                setError({ success: false, msg: "Server Error !" })
                toast.error('UserInfo Required !', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                });
                return;
            }

        }
    }

    useEffect(() => {
        cartItems(localStorage.getItem('cartItem') ? JSON.parse(localStorage.getItem('cartItem')) : []);
    }, [])

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
                        <div className="panel-heading">Place Order</div>
                        <div className="panel-body">
                            <form className="form-horizontal" onSubmit={placeOrder}>
                                <table className="table table-striped">
                                    <thead className="table-head">
                                        <tr>
                                            <th>Product Name</th>
                                            <th> Quntity</th>
                                            <th> SubTotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dis}
                                        <tr>
                                            <td><strong>Total</strong></td>
                                            <td>
                                                <strong>{totalItem}</strong>
                                            </td>
                                            <td><strong><i className="fa fa-inr"></i>{total}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br />

                                <br />
                                <div className="form-group">
                                    <label htmlFor="inputName3" className="col-sm-2 control-label">Enter Order Details</label>
                                    {
                                        Object.entries(error).length > 0 ?
                                            <small htmlFor="inputName3" className="col-sm-2 text-danger control-label pull-right">
                                                *{error.msg}
                                            </small> :
                                            ''
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputName3" className="col-sm-2 control-label">Name</label>
                                    <div className="col-sm-6">
                                        <input
                                            className="form-control"
                                            id="inputName3"
                                            name="userName"
                                            placeholder="Name"
                                            onChange={onChangeInfo}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputEmail3" className="col-sm-2 control-label">Address</label>
                                    <div className="col-sm-6">
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            id="inputEmail3"
                                            placeholder="Deliver Address"
                                            onChange={onChangeInfo}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="col-sm-2 control-label"></label>
                                    <div className="col-sm-6">
                                        <button
                                            className="btn btn-warning"
                                            type="submit"
                                        >
                                            Confirm Order
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            <ToastContainer />
        </div >
    )
}

export default PlaceOrder