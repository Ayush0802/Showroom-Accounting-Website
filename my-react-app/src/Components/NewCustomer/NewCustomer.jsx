import React, { useEffect, useState } from 'react';
import styles from './NewCustomer.module.css';
import { base_url } from '../../assets/help';
import Navbar from "../Navbar/Navbar.jsx";
import axios from 'axios'
import { MdDelete } from "react-icons/md";
import Footbar from "../Footbar/Footbar.jsx"

function NewCustomer() { 

    useEffect(() => {
        document.body.style.backgroundColor = "grey";

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    const [customer, setCustomer] = useState({
        name: '',
        address: '',
        contact: '',
        date: '',
        billno: '',
        products: [{ company: '', name: '',catalog: '', code: '', quantity: '', price: '', total: '' }],
        amountToBePaid: '',
        amountPaidCash: 0,
        amountPaidBank: 0,
        finalamount: '',
        discount: 0,
        transport: 0,
        amountLeftToBePaid: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        updateAmounts();
    }, [customer.products, customer.amountPaidCash, customer.amountPaidBank, customer.discount, customer.transport]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handlebillChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: Number(value) });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const newProducts = [...customer.products];
        newProducts[index][name] = name === "quantity" || name === "price" ? Number(value) : value;
        newProducts[index].total = newProducts[index].quantity * newProducts[index].price;
        setCustomer({ ...customer, products: newProducts });
    };

    const handleAddProduct = () => {
        setCustomer({
            ...customer,
            products: [...customer.products, { company: '', name: '',catalog: '', code: '', quantity: '', price: '', total: '' }],
        });
    };

    const handleDeleteProduct = (index) => {
        const newProducts = [...customer.products];
        newProducts.splice(index, 1);
        setCustomer({ ...customer, products: newProducts });
    };
 
    const updateAmounts = () => {
        const totalAmount = customer.products.reduce(
            (sum, product) => sum + product.total,
            0
        );

        const transport = customer.transport 
        const amountPaid = customer.amountPaidCash + customer.amountPaidBank;
        const discount = customer.discount;
        const amountLeftToBePaid = totalAmount - amountPaid - discount + transport;

        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            amountToBePaid: totalAmount,
            finalamount: totalAmount + transport - discount,
            amountLeftToBePaid: amountLeftToBePaid > 0 ? amountLeftToBePaid : '',
        }));
    };

    const handleAmountPaidCashChange = (e) => {
        const { value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            amountPaidCash: Number(value),
        }));
    };

    const handleAmountPaidBankChange = (e) => {
        const { value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            amountPaidBank: Number(value),
        }));
    };

    const handleDiscountChange = (e) => {
        const { value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            discount: Number(value),
        }));
    };

    const handleTransportChange = (e) => {
        const { value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            transport: Number(value),
        }));
    };

    const handlepaymentupdate = async (paymentData) => {
        try {
            const response = await fetch(`${base_url}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
    
            if (response.ok) {
                const savedPayment = await response.json();
                console.log('Saved Payment:', savedPayment);
            } else {
                const errorData = await response.json();
                console.error('Failed to update payments:', errorData);
            }
        } catch (error) {
            console.error('Error updating payments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Customer Details:', customer);

        const paymentData = {
            date: customer.date,
            billno: Number(customer.billno),
            name: customer.name,
            cashpayment: Number(customer.amountPaidCash),
            bankpayment: Number(customer.amountPaidBank),
        };

        console.log('Payment Data:', paymentData);

        if(paymentData.cashpayment !== 0 || paymentData.bankpayment!==0)
        {
            handlepaymentupdate(paymentData);
        }
        

        try {
            const response = await fetch(`${base_url}/new-customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                setSuccess('Customer saved successfully!');
                setError('');

                setTimeout(() => {
                    setSuccess('');
                    setCustomer({
                        name: '',
                        address: '',
                        contact: '',
                        date: '',
                        billno: '',
                        products: [{ company: '', name: '',catalog: '', code: '', quantity: '', price: '', total: '' }],
                        amountToBePaid: '',
                        amountPaidCash: 0,
                        amountPaidBank: 0,
                        finalamount:'',
                        discount: 0,
                        transport: 0,
                        amountLeftToBePaid: '',
                    });
                }, 2000);
                
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save customer data');
                if (!(errorData.message === "Bill No. Already Exist")) {
                    setCustomer({
                        name: '',
                        address: '',
                        contact: '',
                        date: '',
                        billno: '',
                        products: [{ company: '', name: '',catalog: '', code: '', quantity: '', price: '', total: '' }],
                        amountToBePaid: '',
                        amountPaidCash: 0,
                        amountPaidBank: 0,
                        finalamount:'',
                        discount: 0,
                        transport: 0,
                        amountLeftToBePaid: '',
                    });
                }
            }
        } catch (error) {
            setError('Error saving customer data: ' + error.message);
        }
    };


    const [products, setProducts] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get(`${base_url}/addproduct`)
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching products:", error);
        });
    }, []);

    useEffect(() => {
        axios.get(`${base_url}/addcompany`)
        .then(response => {
            setCompanies(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching companies:", error);
        });
    }, []);

    const addProduct = (newProduct) => {
        axios.post(`${base_url}/addproduct`, newProduct)
        .then(response => {
            const updatedProducts = [...products];
            const existingProductIndex = updatedProducts.findIndex(p => p.name === response.data.name);

            if (existingProductIndex > -1) {
            updatedProducts[existingProductIndex] = response.data;
            } else {
            updatedProducts.push(response.data);
            }

            setProducts(updatedProducts);
        })
        .catch(error => {
            console.error("There was an error adding the product:", error);
        });
    };

    const addCompany = (newCompany) => {
        axios.post(`${base_url}/addcompany`, newCompany)
        .then(response => {
            // Optionally, update state with the new/updated company
        })
        .catch(error => {
            console.error("There was an error adding the company:", error);
        });
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
            <div className={styles.newcustomerpage}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* <h1>Customer Portfolio</h1> */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={customer.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bill Number</label>
                            <input
                                type="number"
                                name="billno"
                                value={customer.billno}
                                onChange={handlebillChange}
                            />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Contact Number</label>
                            <input
                                type="text"
                                name="contact"
                                value={customer.contact}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Products</label>
                        {customer.products.map((product, index) => (
                            <div key={index} className={styles.productGroup}>
                                <select
                                    value={product.name}
                                    name='name'
                                    className={styles.productNN}
                                    onChange={(e) => handleProductChange(index, e)}
                                >
                                    <option value="">Product</option>
                                    {products.map((product) => (
                                    <option key={product._id} value={product.name}>
                                        {product.name}
                                    </option>
                                    ))} 
                                </select>
                                <select
                                    value={product.company}
                                    name='company'
                                    className={styles.companyNN}
                                    onChange={(e) => handleProductChange(index, e)}
                                    disabled={!product.name}
                                >
                                    <option value="">Company</option>
                                    {
                                        products.find(p => p.name === product.name)?.companies.map((company) => (
                                                <option key={company} value={company}>
                                                    {company}
                                                </option>
                                            ))
                                    }
                                </select>
                                <select
                                    value={product.catalog}
                                    name='catalog'
                                    // className={styles.catalogNN}
                                    onChange={(e) => handleProductChange(index, e)}
                                    disabled={!product.company}
                                >
                                    <option value="">Catalog</option>
                                    {
                                        companies.find(company => company.name === product.company)?.catalogs
                                            .map((catalog) => (
                                                <option key={catalog} value={catalog}>
                                                    {catalog}
                                                </option>
                                            ))
                                    }
                                </select>
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="P. Code"
                                    value={product.code}
                                    onChange={(e) => handleProductChange(index, e)}
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, e)}
                                />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={product.price}
                                    onChange={(e) => handleProductChange(index, e)}
                                />
                                <input
                                    type="number"
                                    name="total"
                                    placeholder="Total"
                                    value={product.total}
                                    readOnly
                                    className={styles.readOnlyInput}
                                />
                                <button
                                    type="button" className={styles.deletebutton}
                                    onClick={() => handleDeleteProduct(index)}
                                >
                                    <MdDelete color="red" size={35} />
                                </button>
                            </div>
                        ))}
                        <button className={styles.addbutton} type="button" onClick={handleAddProduct}>
                            Add Product
                        </button>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Total Amount</label>
                            <input
                                type="number"
                                name="amountToBePaid"
                                placeholder="0"
                                value={customer.amountToBePaid}
                                readOnly
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Discount</label>
                            <input
                                type="number"
                                name="discount"
                                placeholder="0"
                                value={customer.discount}
                                onChange={handleDiscountChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Transport</label>
                            <input
                                type="number"
                                name="transport"
                                placeholder="0"
                                value={customer.transport}
                                onChange={handleTransportChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Final Amount</label>
                            <input
                                type="number"
                                name="finalamount"
                                placeholder="0"
                                value={customer.finalamount}
                                readOnly
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Cash</label>
                            <input
                                type="number"
                                name="amountPaidCash"
                                placeholder="0"
                                value={customer.amountPaidCash}
                                onChange={handleAmountPaidCashChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bank</label>
                            <input
                                type="number"
                                name="amountPaidBank"
                                placeholder="0"
                                value={customer.amountPaidBank}
                                onChange={handleAmountPaidBankChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Due</label>
                            <input
                                type="number"
                                name="amountLeftToBePaid"
                                placeholder="0"
                                value={customer.amountLeftToBePaid}
                                readOnly
                            />
                        </div>
                    </div>
                    <button className={styles.savebutton} type="submit">Save Customer</button>
                </form>

                <div className={styles.entireadd}>
                    <div className={styles.addsection}>
                        <h2>Add New Product</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const newProduct = {
                                name: e.target.productName.value,
                                companies: e.target.productCompanies.value.split(',')
                            };
                            addProduct(newProduct);
                            e.target.reset();
                            }}>
                            <input className={styles.addname} name="productName" placeholder="Product Name" />
                            <input className={styles.addsub} name="productCompanies" placeholder="Companies (comma separated)" />
                            <button type="submit">Add Product</button>
                        </form>
                    </div>

                    <div className={styles.addsection}>
                        <h2>Add New Company</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const newCompany = {
                                name: e.target.companyName.value,
                                catalogs: e.target.companyCatalogs.value.split(',')
                            };
                            addCompany(newCompany);
                            e.target.reset();
                            }}>
                            <input className={styles.addname} name="companyName" placeholder="Company Name" />
                            <input className={styles.addsub} name="companyCatalogs" placeholder="Catalogs (comma separated)" />
                            <button type="submit">Add Company</button>
                        </form>
                    </div>
                </div>

                
            </div>
            <Footbar />
        </>
    );
}

export default NewCustomer;
