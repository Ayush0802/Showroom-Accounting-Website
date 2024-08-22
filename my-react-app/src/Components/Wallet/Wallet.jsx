import React,{ useEffect, useState } from 'react';
import styles from './Wallet.module.css';
import { base_url } from '../../assets/help';
import Navbar from "../Navbar/Navbar.jsx"
import Footbar from "../Footbar/Footbar.jsx"

function Wallet(){

    const montharray = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    }

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        // document.body.style.display= ""; 
        // document.body.style.justifyContent= "";

        return () => {
            document.body.style.backgroundColor = "";
          };
    }, []);

    const [customers, setCustomers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [dealers, setDealers] = useState([])

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

    const calculateTotals = (customers) => {
        return customers.reduce((totals, customer) => {
            totals.amountToBePaid += customer.amountToBePaid;
            totals.amountPaidCash += customer.amountPaidCash
            totals.amountPaidBank += customer.amountPaidBank
            totals.amountLeftToBePaid += customer.amountLeftToBePaid;
            return totals;
        }, { amountToBePaid: 0, amountPaidCash: 0, amountPaidBank: 0, amountLeftToBePaid: 0 });
    };

    const totals_customer = calculateTotals(customers);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const response = await fetch(`${base_url}/dealers`);
                if (response.ok) {
                    const data = await response.json();
                    setDealers(data);
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
            totals.cashpayment += Number(dealer.cashpayment);
            totals.bankpayment += Number(dealer.bankpayment);
            return totals;
        }, { cashpayment: 0, bankpayment: 0});
    };

    const totals_dealer = calculatepayment(dealers);


    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`${base_url}/expenses`);
                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
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
        }, { total:0 });
    };

    const totals = calculateexpense(expenses);

    const groupCustomersByMonth = (customers) => {
        return customers.reduce((acc, customer) => {
            const date = new Date(customer.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }

            acc[monthYear] += customer.amountPaidCash + customer.amountPaidBank;
            return acc;
        }, {});
    };

    const monthlyTotals = groupCustomersByMonth(customers);

    const groupDealersByMonth = (dealers) => {
        return dealers.reduce((acc, dealer) => {
            const date = new Date(dealer.date);
            const mon = dealer.month
            const monthYear = `${montharray[mon]}-${date.getFullYear()}`;
            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }

            acc[monthYear] += dealer.cashpayment + dealer.bankpayment;
            return acc;
        }, {});
    };

    const monthlyDealers = groupDealersByMonth(dealers);

    const groupCustomersDueByMonth = (customers) => {
        return customers.reduce((acc, customer) => {
            const date = new Date(customer.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }

            acc[monthYear] += customer.amountLeftToBePaid;
            return acc;
        }, {});
    };

    const monthlyDue = groupCustomersDueByMonth(customers);

    const formatMonthYear = (monthYear) => {
        const [month, year] = monthYear.split('-').map(Number);
        const date = new Date(year, month-1);
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    };

    const groupExpensesByMonth = (expenses) => {
        return expenses.reduce((acc, expense) => {
            const date = new Date(expense.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }

            acc[monthYear] += expense.total;
            return acc;
        }, {});
    };

    const monthlyexpense = groupExpensesByMonth(expenses);

    const calculateMonthlyProfit = (monthlyPayments, monthlyExpenses, monthlyDealers) => {
        const profit = {};
    
        for (const monthYear in monthlyPayments) {
            if (monthlyPayments.hasOwnProperty(monthYear)) {
                const payment = monthlyPayments[monthYear] || 0;
                const expense = monthlyExpenses[monthYear] || 0;
                const dealer = monthlyDealers[monthYear] || 0;
                profit[monthYear] = payment - expense - dealer;
            }
        }
    
        return profit;
    };
    
    const monthlyProfit = calculateMonthlyProfit(monthlyTotals, monthlyexpense, monthlyDealers);
    
    const combinedData = Object.entries(monthlyTotals).map(([monthYear, payment]) => {
        const expense = monthlyexpense[monthYear] || 0;
        const profit = monthlyProfit[monthYear] || 0;
        const due = monthlyDue[monthYear] || 0;
        const dealer = monthlyDealers[monthYear] || 0;
        return { monthYear, payment,dealer, expense, due, profit };
    });

    combinedData.sort((a, b) => {
        const [monthA, yearA] = a.monthYear.split('-');
        const [monthB, yearB] = b.monthYear.split('-');
        return yearA !== yearB ? Number(yearB) - Number(yearA) : Number(monthB) - Number(monthA);
    });

    return(
        <>
            <Navbar />

            <div className={styles.balance}>
                <p>Total Balance : {totals_customer.amountPaidBank + totals_customer.amountPaidCash - totals.total - totals_dealer.cashpayment - totals_dealer.bankpayment}</p>
            </div>   
            <div className={styles.walletcontainer}>         
                <div className={styles.showbox}>
                    <h1>Cash Balance : {totals_customer.amountPaidCash - totals.total - totals_dealer.cashpayment}</h1>
                </div>
                <div className={styles.showbox}>
                    <h1>Bank Balance : {totals_customer.amountPaidBank - totals_dealer.bankpayment}</h1>
                </div>
                <div className={styles.showbox}>
                    <h1>Due : {totals_customer.amountLeftToBePaid}</h1>
                </div>
            </div>

            <div className={styles.tablemonth}>
            <table className={styles.monthlyTable}>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Payment</th>
                        <th>Dealer</th>
                        <th>Expense</th>
                        <th>Due</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {combinedData.map(({ monthYear, payment,dealer, expense,due, profit }) => (
                        <tr key={monthYear}>
                            <td>{formatMonthYear(monthYear)}</td>
                            <td>{payment}</td>
                            <td>{dealer}</td>
                            <td>{expense}</td>
                            <td>{due}</td>
                            <td>{profit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <Footbar/>
        </>
    )
}

export default Wallet