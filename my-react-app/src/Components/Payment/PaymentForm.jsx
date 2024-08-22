import React, { useState, useEffect } from 'react';
import styles from './PaymentForm.module.css';
import { base_url } from '../../assets/help';

const PaymentForm = ({ paymentData, onSave, onClose }) => {

    const [customers, setCustomers] = useState([]);

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


    const [payment, setPayment] = useState({
        date: '',
        billno:'',
        name :'',
        cashpayment: '',
        bankpayment: '',
    });

    useEffect(() => {
        if (paymentData) {
            setPayment({
                ...paymentData,
                date: paymentData.date ? new Date(paymentData.date).toISOString().split('T')[0] : '',
            });
        } else {
            setPayment({
                date: '',
                billno:'',
                name :'',
                cashpayment: '',
                bankpayment: '',
            });
        }
    }, [paymentData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment({ ...payment, [name]: value });
    };

    const handlebillChange = (e) => {
        const { name, value } = e.target;
    
        const requiredCustomer = customers.find(c => c.billno === Number(value));
    
        if (requiredCustomer) {
            setPayment({ ...payment, [name]: value, name: requiredCustomer.name });
        } else {
            setPayment({ ...payment, [name]: value, name:'' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(payment);
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{paymentData ? 'Edit Payment' : 'Add Payment'}</h2>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <label>
                    Date :
                    <input
                        type="date"
                        name="date"
                        className={styles.indate}
                        value={payment.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Bill No. :
                    <input
                        type="number"
                        name="billno"
                        className={styles.inbill}
                        value={payment.billno}
                        onChange={(e)=>handlebillChange(e)}
                        required
                    />
                </label>
                <label>
                    Name :
                    <input
                        type="text"
                        className={styles.inname}
                        value={payment.name}
                        required
                        readOnly
                    />
                </label>
                <label>
                    Cash Payment :
                    <input
                        type="number"
                        name="cashpayment"
                        className={styles.incash}
                        value={payment.cashpayment}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Bank Payment :
                    <input
                        type="number"
                        name="bankpayment"
                        className={styles.inbank}
                        value={payment.bankpayment}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className={styles.bntcontainer}>
                    <button type="submit" className={styles.addpaymentbutton}>
                        {paymentData ? 'Save Changes' : 'Add Payment'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default PaymentForm;
