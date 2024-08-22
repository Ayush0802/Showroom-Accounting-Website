import React, { useEffect, useState } from 'react';
import styles from './Dealer.module.css';
import DealerForm from './DealerForm';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { base_url } from '../../assets/help';
import Navbar from "../Navbar/Navbar.jsx"
import Footbar from "../Footbar/Footbar.jsx"

function Payment() {
    const [dealers, setDealers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDealer, setEditingDealer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDealers, setFilteredDealers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const response = await fetch(`${base_url}/dealers`);
                if (response.ok) {
                    const data = await response.json();
                    setDealers(data);
                    setFilteredDealers(data);
                } else {
                    console.error('Failed to fetch dealers');
                }
            } catch (error) {
                console.error('Error fetching dealers:', error);
            }
        };

        fetchDealers();
    }, []);

    const calculatepayment = (dealers) => {
        return dealers.reduce((totals, dealer) => {
            totals.payment += dealer.cashpayment + dealer.bankpayment;
            return totals;
        }, { payment: 0 });
    };

    const totals = calculatepayment(filteredDealers);

    const handleAddClick = () => {
        setEditingDealer(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (payment) => {
        setEditingDealer(payment);
        setIsModalOpen(true);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchTerm.trim() === '') {
            setFilteredDealers(dealers);
        } else {
            const filtered = dealers.filter((dealer) => 
                dealer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dealer.month.toLowerCase() === searchTerm.toLowerCase() ||
                new Date(dealer.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) === searchTerm ||
                new Date(dealer.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit' }) === searchTerm ||
                new Date(dealer.date).toLocaleDateString('en-GB', { year: 'numeric'}) === searchTerm ||
                new Date(dealer.date).toLocaleDateString('en-GB', {month: '2-digit' }) === searchTerm 
            );
            setFilteredDealers(filtered);
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [dealerToDelete, setDealerToDelete] = useState(null);

    const openPopup = (customer) => {
        setDealerToDelete(customer);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setDealerToDelete(null);
    };

    const confirmDelete = () => {
        handleDeleteClick(dealerToDelete);
        closePopup();
    };

    const handleDeleteClick = async (dealerData) => {
        try {
            const response = await fetch(`${base_url}/dealers/${dealerData._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const dealerId = dealerData._id
                setDealers(dealers.filter((dealer) => dealer._id !== dealerId));
                setFilteredDealers(filteredDealers.filter((dealer) => dealer._id !== dealerId));

            } else {
                console.error('Failed to delete dealer');
            }
        } catch (error) {
            console.error('Error deleting dealer:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingDealer(null);
    };

    const handleModalSave = async (dealerData) => {
        try {
            const method = editingDealer ? 'PUT' : 'POST';
            const url = editingDealer
                ? `${base_url}/dealers/${dealerData._id}`
                : `${base_url}/dealers`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dealerData),
            });

            if (response.ok) {
                const updatedDealer = await response.json();
                setDealers((prevdealers) => {
                    if (editingDealer) {
                        return prevdealers.map((dealer) =>
                            dealer._id === updatedDealer._id ? updatedDealer : dealer
                        );
                    } else {
                        return [...prevdealers, updatedDealer];
                    }
                });
                setFilteredDealers((prevFiltered) => {
                    if (editingDealer) {
                        return prevFiltered.map((dealer) =>
                            dealer._id === updatedDealer._id ? updatedDealer : dealer
                        );
                    } else {
                        return [...prevFiltered, updatedDealer];
                    }
                });

                setIsModalOpen(false);
                setEditingDealer(null);

                setSuccess('Dealer Payment Saved!');
                setError('');

                setTimeout(() => {
                    setSuccess('')
                }, 2000);
            } else {
                setError('Failed to save dealer payment');
                console.error('Failed to save dealer');
            }
        } catch (error) {
            setError('Error saving dealer payment');
            console.error('Error saving dealer:', error);
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
                        <p>Are you sure you want to delete ?</p>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={closePopup}>No</button>
                    </div>
                </div>
            )}

            <div className={styles.dealersPage}>
                <h1>Dealer Payment</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by date, company"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearchClick} className={styles.searchButton}>Search</button>
                </div>
                <div className={styles.buttoncontainer}>
                    <button onClick={handleAddClick} className={styles.addpayment}>Add Payment</button>
                </div>
                
                <div className={styles.dealersContainer}>
                    {filteredDealers.sort((a, b) => new Date(b.date) - new Date(a.date)).map((dealer) => (
                        <div key={dealer._id} className={styles.dealerBlock}>
                                    <p>{new Date(dealer.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <p className={styles.paymonth}>Month : {dealer.month}</p>
                                    <p className={styles.paycompany}>Company : {dealer.company}</p>
                                    <p className={styles.paypayment}>Cash Payment : {dealer.cashpayment}</p>
                                    <p className={styles.paypayment}>Bank Payment : {dealer.bankpayment}</p>
                                    <div className={styles.editdelete}>
                                        <button onClick={() => handleEditClick(dealer)} className={styles.editBut}><FaEdit color="green" size={25} /></button>
                                        <button onClick={() => openPopup(dealer)} className={styles.deleteBut}><MdDelete color="red" size={25} /></button>
                                    </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className={styles.modalC}>
                        <div className={styles.modalContentC}>
                            <DealerForm
                                dealerData={editingDealer}
                                onSave={handleModalSave}
                                onClose={handleModalClose}
                            />
                        </div>
                    </div>
                )}
                <footer className={styles.totals}>
                    <p className={styles.tpayment}>Total Payment: {totals.payment}</p>
                </footer>
            </div>
            <Footbar/>
        </>
    );
}

export default Payment;
