import React, { useEffect, useState } from 'react';
import styles from './PriceList.module.css';
import { base_url } from '../../assets/help';
import Navbar from "../Navbar/Navbar.jsx";
import PriceListForm from './PriceListForm';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Footbar from "../Footbar/Footbar.jsx"

function PriceList() { 

    const [catalogs, setCatalogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCatalog, setEditingCatalog] = useState(null);
    const [filteredCatalogs, setFilteredCatalogs] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const response = await fetch(`${base_url}/catalogs`);
                if (response.ok) {
                    const data = await response.json();
                    setCatalogs(data);
                    // setFilteredCatalogs(data);
                } else {
                    console.error('Failed to fetch Catalogs');
                }
            } catch (error) {
                console.error('Error fetching catalogs:', error);
            }
        };

        fetchCatalogs();
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setSuggestions([]);
        } else {
            const filteredSuggestions = catalogs
                .filter(catalog => 
                    catalog.name.toLowerCase().includes(value.toLowerCase())
                )
                .map(catalog => catalog.name);
            setSuggestions(filteredSuggestions);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        // Optionally, you can trigger the search here
        const filtered = catalogs.filter((catalog) => 
            catalog.name.replace(/\s/g, '').toLowerCase() === suggestion.replace(/\s/g, '').toLowerCase()
        );
        setFilteredCatalogs(filtered);
    };

    const handleSearchClick = () => {
        if (searchTerm.trim() === '') {
            setFilteredCatalogs(null);
        } else {
            const filtered = catalogs.filter((catalog) => 
                catalog.name.replace(/\s/g, '').toLowerCase() === searchTerm.replace(/\s/g, '').toLowerCase()
            );
            setFilteredCatalogs(filtered);
        }
    };

    const handleAddClick = () => {
        setEditingCatalog(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (catalog) => {
        setEditingCatalog(catalog);
        setIsModalOpen(true);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [catalogToDelete, setcatalogToDelete] = useState(null);

    const openPopup = (catalog) => {
        setcatalogToDelete(catalog);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setcatalogToDelete(null);
    };

    const confirmDelete = () => {
        handleDeleteClick(catalogToDelete);
        closePopup();
    };

    const handleDeleteClick = async (Catalog) => {
        try {
            const catalogId = Catalog._id
            const response = await fetch(`${base_url}/catalogs/${catalogId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCatalogs(catalogs.filter((catalog) => catalog._id !== catalogId));
                setFilteredCatalogs(filteredCatalogs.filter((catalog) => catalog._id !== catalogId));
            } else {
                console.error('Failed to delete catalog');
            }
        } catch (error) {
            console.error('Error deleting catalog:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingCatalog(null);
    };

    const handleModalSave = async (catalogData) => {
        try {
            const method = editingCatalog ? 'PUT' : 'POST';
            const url = editingCatalog
                ? `${base_url}/catalogs/${catalogData._id}`
                : `${base_url}/catalogs`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(catalogData),
            });

            if (response.ok) {
                const updatedExpense = await response.json();
                setCatalogs((prevExpenses) => {
                    if (editingCatalog) {
                        return prevExpenses.map((expense) =>
                            expense._id === updatedExpense._id ? updatedExpense : expense
                        );
                    } else {
                        return [...prevExpenses, updatedExpense];
                    }
                });

                setIsModalOpen(false);
                setEditingCatalog(null);

                editingCatalog ? setSuccess('Catalog Price List Updated!') : setSuccess('Catalog Price List Saved!');
                setError('');

                setTimeout(() => {
                    setSuccess('')
                }, 2000);
            } else {
                setError('Error saving Catalog details');
                console.error('Failed to save Catalog details');
            }
        } catch (error) {
            setError('Error saving Catalog details');
            console.error('Error saving Catalog details:', error);
        }
    };

    return (
        <>
            <Navbar />

            {error && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={() => setError('')}>&times;</span>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{success}</p>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete Price List of "{catalogToDelete.name}" ?</p>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={closePopup}>No</button>
                    </div>
                </div>
            )}

            <div className={styles.pricelistPage}>
                <h1>Price List</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Catalog Name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    {/*<button onClick={handleSearchClick} className={styles.searchButton}>Search</button>*/}
                    {suggestions.length > 0 && (
                        <ul className={styles.suggestions}>
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={styles.catalogContainer}>
                    {filteredCatalogs && (
                        <div>
                            {filteredCatalogs.map((catalog) =>(
                            // {console.log(filteredCatalogs)}
                            <div className={styles.expenseBlock}>
                                <h2>{catalog.name}</h2>
                                <div 
                                    className={styles.plusSymbol} 
                                    onClick={() => setIsHovered(prev => !prev)} 
                                >
                                    {isHovered && <FaMinus color="red" size={26} />}
                                    {!isHovered && <FaPlus color="#355cf9" size={26} />}
                                </div>
                                <table className={styles.tablecss}>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>MRP</th>
                                            {isHovered && <th>DP</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {catalog.products.map((product, index) => (
                                            <tr key={index}>
                                                <td>{product.name}</td>
                                                <td>{product.mrp}</td>
                                                {isHovered && <td>{product.dp}</td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                <div className={styles.editDelete}>
                                <button onClick={() => handleEditClick(catalog)} className={styles.editBut}><FaEdit color="green" size={30} /></button>
                                <button onClick={() => openPopup(catalog)} className={styles.deleteBut}><MdDelete color="red" size={30} /></button>
                                <div class={styles.discountbox}>
                                    <div class={styles.discountlabel}>Discount</div>
                                    <div class={styles.discountcontent}>{catalog.discount}</div>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.buttoncontainer}>
                    <button onClick={handleAddClick} className={styles.addbutton}>Add Catalog</button>
                    {/* <button className={styles.addbutton}>Edit Catalog</button> */}
                </div>

                {isModalOpen && (
                    <div className={styles.modalC}>
                        <div className={styles.modalContentC}>
                            <PriceListForm
                                catalogData={editingCatalog}
                                onSave={handleModalSave}
                                onClose={handleModalClose}
                            />
                        </div>
                    </div>
                )}


                {/* <div className={styles.buttoncontainer}>
                    
                </div> */}
                
            </div>
            <Footbar/>
            
        </>
    )
}

export default PriceList; 