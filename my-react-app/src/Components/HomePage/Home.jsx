import React,{ useEffect } from 'react';
import styles from './Home.module.css';
import Plywood  from './images/Plywood.jpg'
import  Laminates from './images/Laminates.jpg'
import  Wallpapers from './images/Wallpapers.jpg'
import Louvers  from './images/Louvers.jpg'
import  Alabaster from './images/Alabaster.jpg'
import  AcrylicSheets from './images/AcrylicSheets.jpg'
import  Charcoal from './images/Charcoal.jpg'
import Wooden  from './images/Wooden.jpg'
import Vinyl  from './images/Vinyl.jpg'
import  MDF from './images/MDF.jpg'
import  PVC from './images/PVC.jpg'
import Decorative  from './images/Decorative.jpg'
import Navbar from "../Navbar/Navbar.jsx"
import Footbar from "../Footbar/Footbar.jsx"

function Home(){

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        // document.body.style.display= ""; 
        // document.body.style.justifyContent= "";

        return () => {
            document.body.style.backgroundColor = "";
          };
    }, []);

    return(
        <>
            <Navbar />

            <div className={styles.homeelements}>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Plywood</h1>
                    <img src={Plywood} alt="Plywood" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Laminates</h1>
                    <img src={Laminates} alt="Laminates" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Wallpapers</h1>
                    <img src={Wallpapers} alt="Wallpapers" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Louvers</h1>
                    <img src={Louvers} alt="Louvers" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Alabaster</h1>
                    <img src={Alabaster} alt="Alabaster" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Acrylic Sheets</h1>
                    <img src={AcrylicSheets} alt="Acrylic Sheets" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Charcoal Panels</h1>
                    <img src={Charcoal} alt="Charcoal" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Wooden Flooring</h1>
                    <img src={Wooden} alt="Wooden" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Vinyl Flooring</h1>
                    <img src={Vinyl} alt="Vinyl" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>MDF Work</h1>
                    <img src={MDF} alt="MDF" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>PVC Sheets</h1>
                    <img src={PVC} alt="PVC" className={styles.hoverimage} />
                </div>
                <div className={styles.product}>
                    <h1 className={styles.productText}>Decorative Items</h1>
                    <img src={Decorative} alt="Decorative" className={styles.hoverimage} />
                </div>
            </div>

            <Footbar />
        </>
    )
}

export default Home

