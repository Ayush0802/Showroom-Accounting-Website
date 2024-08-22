import React,{useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { base_url } from '../../assets/help';
import bgimg from '../../assets/SI.png'

function Register(){
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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${base_url}/register`, { username, email, password })
            .then(result=>{console.log(result)  
            navigate('/login')
            })
            console.log(response);
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    const closePopup = () => {
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className={styles.Registerbox}>
            <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <div className={styles.inputContainer}>
                <FaUser className={styles.icon} color="rgba(254,241,0,255)"size={17}/>
                <input className={styles.inputbox} placeholder="Username" type="text" value={username} onChange={(e)=> setUsername(e.target.value)}/>
            </div>
            <div className={styles.inputContainer}>
                <IoMail className={styles.icon} color="rgba(254,241,0,255)"size={17}/>
                <input className={styles.inputbox} placeholder="Email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
            </div>
            <div className={styles.inputContainer}>
                <FaLock className={styles.icon} color="rgba(254,241,0,255)"size={17}/>
                <input className={styles.inputbox} placeholder="Password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
            </div>
            <div>
                <button className={styles.Registerbutton} type="submit">Register</button>
            </div>
            </form>
            <div className={styles.loginway}>
                <p>Already having an account ?</p>
                <Link to="/">Sign In</Link>
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

export default Register;
