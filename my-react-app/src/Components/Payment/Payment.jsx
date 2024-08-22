import React, { useEffect, useState } from 'react';
import styles from './Payment.module.css';
import PaymentForm from './PaymentForm';
import { MdDelete } from "react-icons/md";
import { base_url } from '../../assets/help';
import Navbar from "../Navbar/Navbar.jsx"
import Footbar from "../Footbar/Footbar.jsx"

function Payment() {
    const [customers, setCustomers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${base_url}/customers`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                } else {
                    console.error('Failed to fetch customers');
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);


    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`${base_url}/payments`);
                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                    setFilteredPayments(data);
                } else {
                    console.error('Failed to fetch payments');
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, []);

    const calculatepayment = (payments) => {
        return payments.reduce((totals, payment) => {
            totals.payment += payment.cashpayment + payment.bankpayment;
            return totals;
        }, { payment: 0 });
    };

    const totals = calculatepayment(filteredPayments);

    const handleAddClick = () => {
        setEditingPayment(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (payment) => {
        setEditingPayment(payment);
        setIsModalOpen(true);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchTerm.trim() === '') {
            setFilteredPayments(payments);
        } else {
            const filtered = payments.filter((payment) => 
                payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.billno === Number(searchTerm) ||
                new Date(payment.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) === searchTerm ||
                new Date(payment.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit' }) === searchTerm ||
                new Date(payment.date).toLocaleDateString('en-GB', { year: 'numeric'}) === searchTerm ||
                new Date(payment.date).toLocaleDateString('en-GB', {month: '2-digit' }) === searchTerm 
            );
            setFilteredPayments(filtered);
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const openPopup = (customer) => {
        setCustomerToDelete(customer);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setCustomerToDelete(null);
    };

    const confirmDelete = () => {
        handleDeleteClick(customerToDelete);
        closePopup();
    };

    const handleDeleteClick = async (paymentData) => {
        try {
            const response = await fetch(`${base_url}/payments/${paymentData._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const paymentId = paymentData._id
                setPayments(payments.filter((payment) => payment._id !== paymentId));
                setFilteredPayments(filteredPayments.filter((payment) => payment._id !== paymentId));

                const requiredCustomer = customers.find(c => c.billno === Number(paymentData.billno));
                requiredCustomer.amountPaidCash -= Number(paymentData.cashpayment)
                requiredCustomer.amountPaidBank -= Number(paymentData.bankpayment)
                requiredCustomer.amountLeftToBePaid += Number(paymentData.bankpayment) + Number(paymentData.cashpayment)
                handleCustomerUpdate(requiredCustomer)

            } else {
                console.error('Failed to delete payment');
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingPayment(null);
    };

    const handleCustomerUpdate = async (customerData) =>{
        try {
            const response = await fetch(`${base_url}/customers/${customerData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });
            

            if (response.ok) {
                const updatedCustomer = await response.json();
                
                setCustomers(customers.map((customer) =>
                    customer._id === updatedCustomer._id ? updatedCustomer : customer
                ));
            } else {
                console.error('Failed to update customer');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const handleModalSave = async (paymentData) => {
        try {
            const method = editingPayment ? 'PUT' : 'POST';
            const url = editingPayment
                ? `${base_url}/payments/${paymentData._id}`
                : `${base_url}/payments`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                const updatedPayment = await response.json();
                setPayments((prevpayments) => {
                    if (editingPayment) {
                        
                        return prevpayments.map((payment) =>
                            payment._id === updatedPayment._id ? updatedPayment : payment
                        );
                    } else {
                        
                        return [...prevpayments, updatedPayment];
                    }
                });
                
                setFilteredPayments((prevFiltered) => {
                    if (editingPayment) {
                        return prevFiltered.map((payment) =>
                            payment._id === updatedPayment._id ? updatedPayment : payment
                        );
                    } else {
                        return [...prevFiltered, updatedPayment];
                    }
                });

                const requiredCustomer = customers.find(c => c.billno === Number(paymentData.billno));
                requiredCustomer.amountPaidCash += Number(paymentData.cashpayment)
                requiredCustomer.amountPaidBank += Number(paymentData.bankpayment)
                requiredCustomer.amountLeftToBePaid -= Number(paymentData.bankpayment) + Number(paymentData.cashpayment)
                handleCustomerUpdate(requiredCustomer)


                setIsModalOpen(false);
                setEditingPayment(null);

                setSuccess('Payment saved successfully!');
                setError('');

                setTimeout(() => {
                    setSuccess('')
                }, 2000);
            } else {
                setError('Error saving payment data');
                console.error('Failed to save payment');
            }
        } catch (error) {
            setError('Error saving payment data');
            console.error('Error saving payment:', error);
        }
    };

    const logOut=()=>{
        window.localStorage.clear()
        navigate('/login')
    }

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
                        <p>Are you sure you want to delete payment of Bill No. : {customerToDelete.billno}?</p>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={closePopup}>No</button>
                    </div>
                </div>
            )}

            <div className={styles.paymentsPage}>
                <h1>Payment Entry</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by date, bill no."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearchClick} className={styles.searchButton}>Search</button>
                </div>
                <div className={styles.buttoncontainer}>
                    <button onClick={handleAddClick} className={styles.addpayment}>Add Payment</button>
                </div>
                
                <div className={styles.paymentsContainer}>
                    {filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((payment) => (
                        <div key={payment._id} className={styles.paymentBlock}>
                                    <p>{new Date(payment.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <p className={styles.paybillno}>Bill No. : {payment.billno}</p>
                                    <p className={styles.payname}>Name : {payment.name}</p>
                                    <p className={styles.paypayment}>Cash Payment : {payment.cashpayment}</p>
                                    <p className={styles.paypayment}>Bank Payment : {payment.bankpayment}</p>
                                    {/* <button onClick={() => handleEditClick(payment)} className={styles.editBut}><FaEdit color="green" size={25} /></button> */}
                                    <button onClick={() => openPopup(payment)} className={styles.deleteBut}><MdDelete color="red" size={25} /></button>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className={styles.modalC}>
                        <div className={styles.modalContentC}>
                            <PaymentForm
                                paymentData={editingPayment}
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
