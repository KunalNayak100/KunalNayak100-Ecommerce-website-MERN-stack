import React, { Fragment, useState } from "react";
import './Search.css'
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const Search = () => {
  const [keyword, setKeyword] = useState("");

  //ye khud add kra h, history.push nhi chlra tha, vo change hogya h useNavigate se
  const navigate=useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
