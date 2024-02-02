import React from "react";
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import store from "./store";
import { loadUser } from "./actions/userAction.js";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js"
import ProductList from "./component/Admin/ProductList.js"
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import NotAccessiblePage from "./component/Admin/NotAccessiblePage.js";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch=useDispatch();
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    dispatch(loadUser());
  }, []);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route extact path="/" Component={Home} />
        <Route extact path="/product/:id" Component={ProductDetails} />
        <Route extact path="/products" Component={Products} />
        <Route path="/products/:keyword" Component={Products} />
        <Route extact path="/search" Component={Search} />

        {/* <ProtectedRoute  exact path="/account" Component={Profile}/> */}

        <Route path="/account" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>}/>
        <Route path="/me/update" element={ <ProtectedRoute isAuthenticated={isAuthenticated}> <UpdateProfile /> </ProtectedRoute>}/>
        <Route path="/password/update" element={ <ProtectedRoute isAuthenticated={isAuthenticated}> <UpdatePassword /> </ProtectedRoute>}/>
        
        <Route extact path="/password/forgot" Component={ForgotPassword} />
        <Route extact path="/password/reset/:token" Component={ResetPassword} />
        <Route extact path="/login" Component={LoginSignUp} />
        <Route extact path="/cart" Component={Cart} />

        <Route path="/shipping" element={<ProtectedRoute isAuthenticated={isAuthenticated} redirect={"shipping"}><Shipping/></ProtectedRoute>}/>
        
        <Route path="/success" element={<ProtectedRoute isAuthenticated={isAuthenticated} redirect={"success"}><OrderSuccess/></ProtectedRoute>}/>
        
        
        <Route path="/orders" element={<ProtectedRoute isAuthenticated={isAuthenticated} redirect={"orders"}><MyOrders/></ProtectedRoute>}/>
        


        <Route path="/order/confirm" element={<ProtectedRoute isAuthenticated={isAuthenticated} redirect={"order/confirm"}><ConfirmOrder/></ProtectedRoute>}/>
        <Route path="/order/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} redirect={"order/:id"}><OrderDetails/></ProtectedRoute>}/>
        
        {/* admin routes */}
        {/* temporary isko normal route banaya hai , video me 12:50 k aaspaas hai */}
        {/* <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}><Dashboard/></ProtectedRoute>}/> */}
        <Route extact path="/admin/dashboard" Component={ (isAuthenticated && user.role=="admin")?Dashboard:NotAccessiblePage} />
        <Route extact path="/admin/products" Component={(isAuthenticated && user.role=="admin")?ProductList:NotAccessiblePage} />
        <Route extact path="/admin/product" Component={(isAuthenticated && user.role=="admin")?NewProduct:NotAccessiblePage} />
        <Route extact path="/admin/product/:id" Component={(isAuthenticated && user.role=="admin")?UpdateProduct:NotAccessiblePage} />
        <Route extact path="/admin/orders" Component={(isAuthenticated && user.role=="admin")?OrderList:NotAccessiblePage} />
        <Route extact path="/admin/order/:id" Component={(isAuthenticated && user.role=="admin")?ProcessOrder:NotAccessiblePage} />
        <Route extact path="/admin/users" Component={(isAuthenticated && user.role=="admin")?UsersList:NotAccessiblePage} />
        <Route extact path="/admin/user/:id" Component={(isAuthenticated && user.role=="admin")?UpdateUser:NotAccessiblePage} />
        <Route extact path="/admin/reviews" Component={(isAuthenticated && user.role=="admin")?ProductReviews:NotAccessiblePage} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
