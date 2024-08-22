import React,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import { base_url } from '../../assets/help';
import bgimg from '../../assets/SI.png'

function Login(){
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgimg})`;
        document.body.style.backgroundColor = "black";
        document.body.style.backgroundSize = '200rem';
        document.body.style.backgroundPosition = '50%';
        document.body.style.backgroundPositionY = '-89rem';
        document.body.style.display= "flex"; 
        document.body.style.justifyContent= "center";

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = "";
          };
    }, []);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${base_url}/login`, { username, password })
            .then(result=>{console.log(result)
            if(result.data.message === "Success"){  
                window.localStorage.setItem('access_token', result.data.access_token);
                window.localStorage.setItem('isLoggedIn', true);

                navigate('/home')
            }
            })
            console.log(response);
            
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                console.log(err)
                setError("An unexpected error occurred");
            }
        }
    };

    const closePopup = () => {
        setError('');
        setUsername('');
        setPassword('');
    };

    return (

            <div className={styles.Loginbox}>
                <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <div className={styles.inputContainer}>
                    <FaUser className={styles.icon} color="rgba(254,241,0,255)"size={17}/>
                    <input className={styles.inputbox} placeholder="Username" type="text" value={username} onChange={(e)=> setUsername(e.target.value)}/>   
                </div>
                <div className={styles.inputContainer}>
                    <FaLock className={styles.icon} color="rgba(254,241,0,255)"size={17}/>
                    <input className={styles.inputbox} placeholder="Password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                </div>
                <div className={styles.remfor}>
                    <label className={styles.remmm}><input type="checkbox" />Remember Me</label>
                    <a href="#">Forgot Password</a>
                </div>
                <div>
                    <button className={styles.loginbutton} type="submit">Login</button>
                </div>
                </form>
                <div className={styles.registerway}>
                    <p>Don't have an account ?</p>
                    <Link to="/register">Sign Up</Link>
                </div>
                {error && (
                <>
                    <div className={styles.popup}>
                        <p>{error}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </>
                )}
            </div>
    );
}

export default Login;
