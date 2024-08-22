import React, { useEffect, useState } from 'react';
import styles from './Expense.module.css';
import ExpenseForm from './ExpenseForm';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { base_url } from '../../assets/help';
import Navbar from "../Navbar/Navbar.jsx"
import Footbar from "../Footbar/Footbar.jsx"

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`${base_url}/expenses`);
                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                    setFilteredExpenses(data);
                } else {
                    console.error('Failed to fetch expenses');
                }
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    const calculateexpense = (expenses) => {
        return expenses.reduce((totals, expense) => {
            totals.total += expense.total;
            return totals;
        }, { total: 0 });
    };

    const totals = calculateexpense(filteredExpenses);

    const handleAddClick = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchTerm.trim() === '') {
            setFilteredExpenses(expenses);
        } else {
            const filtered = expenses.filter((expense) =>
                new Date(expense.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) === searchTerm ||
                new Date(expense.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit' }) === searchTerm ||
                new Date(expense.date).toLocaleDateString('en-GB', { year: 'numeric'}) === searchTerm ||
                new Date(expense.date).toLocaleDateString('en-GB', {month: '2-digit' }) === searchTerm 
            );
            setFilteredExpenses(filtered);
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

    const handleDeleteClick = async (expenseId) => {
        try {
            const response = await fetch(`${base_url}/expenses/${expenseId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setExpenses(expenses.filter((expense) => expense._id !== expenseId));
                setFilteredExpenses(filteredExpenses.filter((expense) => expense._id !== expenseId));
            } else {
                console.error('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    const handleModalSave = async (expenseData) => {
        try {
            const method = editingExpense ? 'PUT' : 'POST';
            const url = editingExpense
                ? `${base_url}/expenses/${expenseData._id}`
                : `${base_url}/expenses`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            });

            if (response.ok) {
                const updatedExpense = await response.json();
                setExpenses((prevExpenses) => {
                    if (editingExpense) {
                        return prevExpenses.map((expense) =>
                            expense._id === updatedExpense._id ? updatedExpense : expense
                        );
                    } else {
                        return [...prevExpenses, updatedExpense];
                    }
                });
                setFilteredExpenses((prevFiltered) => {
                    if (editingExpense) {
                        return prevFiltered.map((expense) =>
                            expense._id === updatedExpense._id ? updatedExpense : expense
                        );
                    } else {
                        return [...prevFiltered, updatedExpense];
                    }
                });

                setIsModalOpen(false);
                setEditingExpense(null);

                editingExpense ? setSuccess('Expense details Updated!') : setSuccess('Expense details Saved!');
                setError('');

                setTimeout(() => {
                    setSuccess('')
                }, 2000);
            } else {
                setError('Error saving Expense details');
                console.error('Failed to save expense details');
            }
        } catch (error) {
            setError('Error saving Expense details');
            console.error('Error saving expense details:', error);
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

            <div className={styles.expensesPage}>
                <h1>Day-to-Day Expenses</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by date"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearchClick} className={styles.searchButton}>Search</button>
                </div>
                <div className={styles.buttoncontainer}>
                    <button onClick={handleAddClick} className={styles.addbutton}>Add Expense</button>
                </div>
                
                <div className={styles.expensesContainer}>
                    {filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map((expense) => (
                        <div key={expense._id} className={styles.expenseBlock}>
                            <div className={styles.expenseSummary}>
                                <div>
                                    <p>{new Date(expense.date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <p className={styles.totalcost}>Cost : {expense.total}</p>
                                </div>
                                <div className={styles.editDelete}>
                                    <button onClick={() => handleEditClick(expense)} className={styles.editBut}><FaEdit color="green" size={25} /></button>
                                    <button onClick={() => openPopup(expense._id)} className={styles.deleteBut}><MdDelete color="red" size={25} /></button>
                                </div>
                            </div>
                            <div className={styles.expenseDetails}>
                                <p>Items:</p>
                                <ul>
                                    {expense.items.map((item, index) => (
                                        <li key={index}>
                                            {item.name}: {item.cost}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className={styles.modalC}>
                        <div className={styles.modalContentC}>
                            <ExpenseForm
                                expenseData={editingExpense}
                                onSave={handleModalSave}
                                onClose={handleModalClose}
                            />
                        </div>
                    </div>
                )}
                <footer className={styles.totals}>
                    <p className={styles.texpense}>Total Expense: {totals.total}</p>
                </footer>
            </div>
            <Footbar/>
        </>
    );
}

export default Expenses;
