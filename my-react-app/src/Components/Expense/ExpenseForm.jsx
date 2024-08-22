import React, { useState, useEffect } from 'react';
import styles from './ExpenseForm.module.css';

const ExpenseForm = ({ expenseData, onSave, onClose }) => {
    const [expense, setExpense] = useState({
        date: '',
        items: [{ name: '', cost: '' }],
        total: 0,
    });

    useEffect(() => {
        if (expenseData) {
            setExpense({
                ...expenseData,
                date: expenseData.date ? new Date(expenseData.date).toISOString().split('T')[0] : '',
            });
        } else {
            setExpense({
                date: '',
                items: [{ name: '', cost: '' }],
                total: 0,
            });
        }
    }, [expenseData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense({ ...expense, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...expense.items];
        newItems[index][name] = name === 'cost' ? Number(value) : value;
        setExpense({ ...expense, items: newItems });
        calculateTotalCost(newItems);
        
    };

    const handleAddItem = () => {
        setExpense({
            ...expense,
            items: [...expense.items, { name: '', cost: '' }],
        });
    };

    const handleDeleteItem = (index) => {
        const newitems = [...expense.items];
        newitems.splice(index, 1);
        const total = newitems.reduce((sum, item) => sum + Number(item.cost), 0);
        setExpense({ ...expense, items: newitems,total });
    };
    
    const calculateTotalCost = (items) => {
        const total = items.reduce((sum, item) => sum + Number(item.cost), 0);
        setExpense({ ...expense, total });
    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(expense);
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{expenseData ? 'Edit Expense' : 'Add Expense'}</h2>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        className={styles.indate}
                        value={expense.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>Items:</label>
                {expense.items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Item Name"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="cost"
                            placeholder="Cost"
                            value={item.cost}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                        <button type="button" className={styles.deletebutton} onClick={() => handleDeleteItem(index)}>
                            Delete
                        </button>
                    </div>
                ))}
                <button type="button" className={styles.additembutton} onClick={handleAddItem}>
                    Add Item
                </button>
                <label>
                    Total Cost:
                    <input className={styles.intotalcost} type="number" value={expense.total} readOnly />
                </label>
                <div className={styles.bntcontainer}>
                    <button type="submit" className={styles.addexpensebutton}>
                        {expenseData ? 'Save Changes' : 'Add Expense'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ExpenseForm;
