import React, { useState, useEffect } from 'react';
import styles from './DealerForm.module.css';
import { base_url } from '../../assets/help';

const DealerForm = ({ dealerData, onSave, onClose }) => {

    const companynames = ['Advance', 'Delta']
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [dealer, setDealer] = useState({
        date: '',
        month:'',
        company :'',
        cashpayment: '',
        bankpayment: '',
    });

    useEffect(() => {
        if (dealerData) {
            setDealer({
                ...dealerData,
                date: dealerData.date ? new Date(dealerData.date).toISOString().split('T')[0] : '',
            });
        } else {
            setDealer({
                date: '',
                month:'',
                company :'',
                cashpayment: '',
                bankpayment: '',
            });
        }
    }, [dealerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDealer({ ...dealer, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(dealer);
    };

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${base_url}/addcompany`);
                if (response.ok) {
                    const data = await response.json();
                    setCompanies(data);
                } else {
                    console.error('Failed to fetch companies');
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setDealer({ ...dealer, [name]: value });
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setSuggestions([]);
        } else {
            const filteredSuggestions = companies
                .filter(companie => 
                    companie.name.toLowerCase().includes(value.toLowerCase())
                )
                .map(companie => companie.name);
            setSuggestions(filteredSuggestions);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        // Optionally, you can trigger the search here
        const filtered = companies.filter((companie) => 
            companie.name.replace(/\s/g, '').toLowerCase() === suggestion.replace(/\s/g, '').toLowerCase()
        );
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{dealerData ? 'Edit Payment' : 'Add Payment'}</h2>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <label>
                    Date :
                    <input
                        type="date"
                        name="date"
                        className={styles.indate}
                        value={dealer.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Month :
                    <input
                        type="text"
                        name="month"
                        className={styles.inmonth}
                        value={dealer.month}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Company :
                    {/* <select
                        name="company"
                        value={dealer.company}
                        className={styles.inname}
                        onChange={(e) => handleChange(e)}
                    >
                        <option value=""></option>
                        {(companies.sort((a,b) => a.name - b.name)).map((company) => (
                            <option key={company.name} value={company.name}>{company.name}</option>
                        ))}
                    </select> */}
                    <input
                        name="company"
                        type="text"
                        placeholder=""
                        value={dealer.company = searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                  
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
                </label>
                <label>
                    Cash Payment :
                    <input
                        type="number"
                        name="cashpayment"
                        className={styles.incash}
                        value={dealer.cashpayment}
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
                        value={dealer.bankpayment}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className={styles.bntcontainer}>
                    <button type="submit" className={styles.addpaymentbutton}>
                        {dealerData ? 'Save Changes' : 'Add Payment'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default DealerForm;
