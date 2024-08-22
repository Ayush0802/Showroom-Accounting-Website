import React, { useEffect, useState } from 'react';
import styles from './Customers.module.css';
import CustomerForm from './CustomerForm.jsx';
import { base_url } from '../../assets/help.js';
import Navbar from "../Navbar/Navbar.jsx"
import Footbar from "../Footbar/Footbar.jsx"

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        // document.body.style.display = "";
        // document.body.style.justifyContent = "";

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`${base_url}/payments`);
                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                } else {
                    console.error('Failed to fetch payments');
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${base_url}/customers`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                    setFilteredCustomers(data);
                } else {
                    console.error('Failed to fetch customers');
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const calculateTotals = (customers) => {
        return customers.reduce((totals, customer) => {
            totals.amountToBePaid += customer.amountToBePaid;
            totals.amountPaidCash += customer.amountPaidCash
            totals.amountPaidBank += customer.amountPaidBank
            totals.amountLeftToBePaid += customer.amountLeftToBePaid;
            return totals;
        }, { amountToBePaid: 0, amountPaidCash: 0, amountPaidBank: 0, amountLeftToBePaid: 0 });
    };

    const totals = calculateTotals(filteredCustomers);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        const filtered = customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.billno === Number(searchTerm) ||
            new Date(customer.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) === searchTerm ||
            new Date(customer.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit' }) === searchTerm ||
            new Date(customer.date).toLocaleDateString('en-GB', { year: 'numeric'}) === searchTerm
        );
        setFilteredCustomers(filtered);
    };

    const handleEditClick = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDeletePayment = async (paymentData) => {
        try {
            const response = await fetch(`${base_url}/payments/${paymentData._id}`, {
                method: 'DELETE',
            });
        }catch (error) {
            console.error('Error deleting payment:', error);
        }
    }

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

    const handleDeleteClick = async (customerData) => {
        const customerId = customerData._id
        try {
            const response = await fetch(`${base_url}/customers/${customerId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCustomers(customers.filter((customer) => customer._id !== customerId));
                setFilteredCustomers(filteredCustomers.filter((customer) => customer._id !== customerId));

                const requiredpayment = payments.find(c => c.billno === Number(customerData.billno));
                console.log(requiredpayment)
                handleDeletePayment(requiredpayment)
            } else {
                console.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
        setTimeout(() => {
            document.body.style.backgroundColor = "grey";
        },10)
    };

    const handleModalSave = async (customerData) => {
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
                
                setIsModalOpen(false);

                setSuccess('Customer details Edited successfully!');
                setTimeout(() => {
                    setSuccess('')
                    document.body.style.backgroundColor = "grey";
                    window.location.reload();
                },2000)

            } else {
                setError('Failed to update customer')
                console.error('Failed to update customer');
            }
        } catch (error) {
            setError('Error updating customer')
            console.error('Error updating customer:', error);
        }
    };

    return (
        <>
            <Navbar />
            {error && (
                <div className={styles.modalA}>
                    <div className={styles.modalContentA}>
                        <span className={styles.close} onClick={() => setError('')}>&times;</span>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className={styles.modalA}>
                    <div className={styles.modalContentA}>
                        <p>{success}</p>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete Bill No. : {customerToDelete.billno}?</p>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={closePopup}>No</button>
                    </div>
                </div>
            )}
            <div className={styles.customerpage}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by name, date, or bill no."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearchClick} className={styles.searchButton}>Search</button>
                </div>

                <div className={styles.customersContainer}>
                    {filteredCustomers.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((customer) => (
                        <div key={customer._id} className={styles.customerBlock}>
                            <div className={styles.customerSummary}>
                                <div className={styles.customerB}>    
                                    <p>Bill No: {customer.billno}</p>
                                    <p className={styles.name}>Name: {customer.name}</p>
                                    <p className={styles.amtpaid}>Paid: {customer.amountPaidCash + customer.amountPaidBank}</p>
                                    <p className={styles.due}>Due: {customer.amountLeftToBePaid}</p>
                                </div>
                                <div className={styles.editdelete}>
                                    <button onClick={() => handleEditClick(customer)} className={styles.editButton}>Edit</button>
                                    <button onClick={() => openPopup(customer)} className={styles.deleteButton}>Delete</button>
                                </div>
                            </div>
                            <div className={styles.customerDetails}>
                                <p>Address: {customer.address}</p>
                                <p>Contact: {customer.contact}</p>
                                <p>Date: {new Date(customer.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                <p>Total Amount: {customer.amountToBePaid}</p>
                                <p>Discount: {customer.discount}</p>
                                <p>Transport: {customer.transport}</p>
                                <p>Final Amount: {customer.finalamount}</p>
                                <p>Paid in Cash: {customer.amountPaidCash}</p>
                                <p>Paid in Bank: {customer.amountPaidBank}</p>
                                <p>Products:</p>
                                <ul>
                                    {customer.products.map((product) => (
                                        <li key={product._id}>
                                            {product.name}:{product.company}:{product.catalog}:{product.code} - {product.quantity} @ {product.price} each (Total: {product.total})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className={styles.modalB}>
                        <div className={styles.modalContentB}>
                            <CustomerForm customerData={editingCustomer} onSave={handleModalSave} onClose={handleModalClose} />
                        </div>
                    </div>
                )}
                
                <footer className={styles.totals}>
                    <p className={styles.tamt}>Total Amount: {totals.amountToBePaid}</p>
                    <p className={styles.amtpaid}>Cash Payment: {totals.amountPaidCash}</p>
                    <p className={styles.amtpaid}>Bank Payment: {totals.amountPaidBank}</p>
                    <p className={styles.due}>Due: {totals.amountLeftToBePaid}</p>
                </footer>
            </div>

            <Footbar/>
        </>
    );
}

export default Customers;
