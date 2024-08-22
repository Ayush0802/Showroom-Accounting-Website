import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import NI from '../../assets/SI_2.png';
import styles from "./Navbar.module.css";

function Navbar(){

    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        window.localStorage.clear();
        navigate('/'); 
    };

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };
    
    return(
        <>
            <nav className={styles.navbar}>
                <ul>
                    <img src={NI} alt="Header" size="10px" className={styles.headerimage} />
                    <li><NavLink to="/home" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink></li>
                    <li><NavLink to="/new-customer" className={({ isActive }) => isActive ? styles.active : ''}>New Customer</NavLink></li>
                    <li><NavLink to="/customers" className={({ isActive }) => isActive ? styles.active : ''}>Customers</NavLink></li>
                    <li><NavLink to="/payment" className={({ isActive }) => isActive ? styles.active : ''}>Payment</NavLink></li>
                    <li><NavLink to="/dealer" className={({ isActive }) => isActive ? styles.active : ''}>Dealer</NavLink></li>
                    <li><NavLink to="/expense" className={({ isActive }) => isActive ? styles.active : ''}>Expense</NavLink></li>
                    <li><NavLink to="/wallet" className={({ isActive }) => isActive ? styles.active : ''}>Wallet</NavLink></li>
                    <li><NavLink to="/pricelist" className={({ isActive }) => isActive ? styles.active : ''}>Price List</NavLink></li>
                    <li><NavLink to="#" onClick={openPopup}>Logout</NavLink></li>
                </ul>
            </nav>

            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to log out?</p>
                        <button onClick={handleLogout}>Yes</button>
                        <button onClick={closePopup}>No</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar;