import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getProducts } from '../Service/Service'
import { ToastContainer } from 'react-toastify';
const Home = () => {

  //for products
  const [apiData, setApiData] = useState([]);
  const [apiDataBackup, setApiDataBackup] = useState([]);
  // const [showProducts, setShowProducts] = useState([]);
  const [color, setColor] = useState(() => ['bg-info', "bg-success", "bg-warning", "bg-danger"]);
  const [cartCount, setCartCount] = useState(() => {
    return localStorage.getItem('cartCount') ? JSON.parse(localStorage.getItem('cartCount')) : 0
  });
  const [sort, setSort] = useState(() => "Default");

  //for sorting data
  function sorting(arr, type) {
    switch (type) {
      case "LowToHigh": return arr.sort((a, b) => a.price - b.price);
      case "HighToLow": return arr.sort((a, b) => b.price - a.price);
      default: return currentItem
    }
  }

  //gets products
  async function getData() {
    try {
      const res = await getProducts('getAllProducts');
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  //add to cart
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

  //setting showing data
  const setShowData = (res) => {
    let i = 0;
    let arr = [];
    res = sorting(res, sort);
    console.log(res);
    while (i < res.length) {
      const na = res.slice(i, i + 4);
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
    return arr
    // setShowProducts(arr);
  }


  //setting select value
  const setSelectOption = (e) => {
    setSort(e.target.value);
    let arr = [...apiData];
    currentItem = sorting(arr, e.target.value);
    // setShowData(res)
  }



  /* Paggination Logic */
  ///////////////////////////////////////////////////////////
  //-- pagination start
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5)

  // eslint-disable-next-line no-unused-vars
  const [pageNumberLimit, setPageNumberLimit] = useState(apiData.length % itemPerPage);

  const [maxPageLimit, setMaxPageLimit] = useState(10);
  const [minPageLimit, setMinPageLimit] = useState(0);

  const pages = [];

  for (let i = 1; i <= Math.ceil(apiData.length / itemPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;

  let currentItem = apiData.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItem);

  const handlePagination = (e) => {
    setCurrentPage(Number(e.target.id))
  }

  const renderPageNumber = pages.map((number) => {
    if (number > minPageLimit && number < maxPageLimit + 1) {
      return (
        <li
          key={number}
          id={number}
          className={`page-item ${currentPage === Number(number) ? 'active' : null}`}
          onClick={
            (e) => handlePagination(e)
          }
        >
          <span className="page-link" key={number}
            id={number}>
            {number}
          </span>
        </li>
      )
    }
    else {
      return null;
    }
  })

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageLimit(maxPageLimit - pageNumberLimit);
      setMinPageLimit(minPageLimit - pageNumberLimit);
    }
  }

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageLimit) {
      setMaxPageLimit(maxPageLimit + pageNumberLimit);
      setMinPageLimit(minPageLimit + pageNumberLimit);
    }
  }
  //---/pagination End
  ///////////////////////////////////////////////////////////

  /*end Paggination Logic */

  //for loading api
  useEffect(() => {
    const get = async () => {
      const res = await getData();
      setShowData(res.products)
      setApiData(res.products);
      setApiDataBackup(res.products)
    }
    get()
  }, [])

  useEffect(() => {
    setShowData(currentItem);
  }, [currentItem,itemPerPage])



  return (
    <div className="container">
      <h1>
        <a href="/">My Ecommerce Site</a>
        <span className="pull-right">
          <Link to="/cart">Cart({cartCount})</Link>
        </span>
      </h1>
      <hr />
      <div className="row">
        <div className="col-sm-12">
          <div style={{ margin: "25px 0px" }}>
            <label htmlFor="" className="control-label">Sort by:</label>

            <select defaultValue={sort} onChange={setSelectOption}>
              <option value="Default">Default</option>
              <option value="HighToLow">High to Low</option>
              <option value="LowToHigh">Low to High</option>
            </select>
          </div>
        </div>
      </div>
      <>
        {/* {showProducts}
         */}

        {setShowData(currentItem)}
      </>
      <div className="row">
        <div className="col-sm-8">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === pages[0] ? 'disabled' : ''}`}                      >
                <span className="page-link"
                  disabled={currentPage === pages[0] ? true : false}
                  onClick={handlePrev}
                >
                  Previous
                </span>
              </li >

              {/* <li className="page-item"><span className="page-link">Previous</span></li> */}
              {
                renderPageNumber
              }
              <li className={`page-item ${currentPage === pages.length ? 'disabled' : ''}`}
              >
                <span className="page-link"
                  disabled={Number(currentPage) === Number(pages[pages.length]) ? true : false}
                  onClick={handleNext}
                >
                  Next
                </span>
              </li>
            </ul>
          </nav >

        </div>
        <div className="col-sm-4 text-right">
          <div style={{ margin: "25px 0px" }}>
            <label htmlFor="" className="control-label">Items Per Page:</label>
            <select
              className="form-select-sm"
              onChange={(e) => {
                currentItem=apiData.slice(indexOfFirstItem, indexOfLastItem);
                setItemPerPage(Number(e.target.value))
              }}
              defaultValue={itemPerPage}>
              <option value="05">05</option>
              <option value="10">10</option>
              <option value="20">25</option>
              <option value="100">50</option>
            </select>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Home
