import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getProducts } from '../Service/Service'
import { ToastContainer } from 'react-toastify';
const Home = () => {

  //for products
  const [showProducts, setShowProducts] = useState([]);
  const [color, setColor] = useState(() => ['bg-info', "bg-success", "bg-warning", "bg-danger"]);
  const [cartCount, setCartCount] = useState(() => {
    return localStorage.getItem('cartCount') ? JSON.parse(localStorage.getItem('cartCount')) : 0
  });

  //gets products
  async function getData() {
    try {
      const res = await getProducts('getAllProducts');
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  const AddToCart = ({ _id, image, name, price }) => {
    let localStorageData = JSON.parse(localStorage.getItem('cartItem'));
    let arr = localStorageData ? localStorageData : []

    if (arr.length == 0) {
      let obj = { _id, image, name, price, qty: 1 }
      arr.push(obj)
      localStorage.setItem('cartItem', JSON.stringify(arr));
      localStorage.setItem('cartCount', JSON.stringify(arr.length));
      setCartCount(prev => prev + 1)
    }
    else {
      let obj = { _id, image, name, price, qty: 1 }
      let flag = true;
      let data = arr.map((item) => {
        if (_id == item._id) {
          item.qty = item.qty + 1;
          flag = false;
        }
        return item;
      })

      if (flag) {
        data.push(obj);
        setCartCount(data.length);
      }
      localStorage.setItem('cartCount', (data.length));
      localStorage.setItem('cartItem', JSON.stringify(data));
    }
  }


  const setShowData = (res) => {
    let i = 0;
    let arr = [];
    while (i < res.products.length) {
      const na = res.products.slice(i, i + 4);
      let e = na.map(({ _id, image, name, price }, index) => {
        return (
          <div className="col-md-3" key={_id} >
            <div className={color[index]}>
              <img src={`http://interviewapi.ngminds.com/${image}`} width="100" height="200" alt={name} />
              <br /><br />
              <p>{name}</p>
              <p><i className="fa fa-inr"></i>{price}</p>
              <span className="btn btn-warning" onClick={(e) => AddToCart({ _id, image, name, price })}>Add to Cart</span>
            </div>
          </div>
        )
      })
      arr.push(<div key={i}><div className="row">{e}</div><hr /></div>)
      i += 4;
    }
    setShowProducts(arr);
  }

  useEffect(() => {
    const get = async () => {
      const res = await getData();
      setShowData(res)
    }
    get()
  }, [])


  return (
    <div className="container">
      <h1>
        <a href="/">My Ecommerce Site</a>
        <span className="pull-right">
          <Link to="/cart">Cart({cartCount})</Link>
        </span>
      </h1>
      <hr />
      {showProducts}
      <ToastContainer />
    </div>

  )
}

export default Home
