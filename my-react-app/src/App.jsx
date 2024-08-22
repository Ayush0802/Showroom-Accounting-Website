import { BrowserRouter,Routes, Route} from 'react-router-dom';
import Register from "./Components/RegisterForm/Register.jsx"
import Login from "./Components/LoginForm/Login.jsx"
import Home from "./Components/HomePage/Home.jsx"
import Wallet from "./Components/Wallet/Wallet.jsx"
import Customers from "./Components/Customers/Customers.jsx"
import NewCustomer from "./Components/NewCustomer/NewCustomer.jsx"
import Expense from "./Components/Expense/Expense.jsx"
import Payment from "./Components/Payment/Payment.jsx"
import Dealer from "./Components/Dealer/Dealer.jsx"
import PriceList from "./Components/PriceList/PriceList.jsx"
import PrivateRoute from './Components/PrivateRoute/PrivateRoute.jsx';

function App() {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn")
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={isLoggedIn==true?<Home/>:<Login/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/home" element={<PrivateRoute element={Home}/>} />  
                <Route path="/register" element={<Register/>} />
                <Route path="/new-customer" element={<PrivateRoute element={NewCustomer}/>} />
                <Route path="/customers" element={<PrivateRoute element={Customers}/>} />
                <Route path="/payment" element={<PrivateRoute element={Payment}/>} />
                <Route path="/dealer" element={<PrivateRoute element={Dealer}/>} />
                <Route path="/expense" element={<PrivateRoute element={Expense}/>} />
                <Route path="/wallet" element={<PrivateRoute element={Wallet}/>} />
                <Route path="/pricelist" element={<PrivateRoute element={PriceList}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
