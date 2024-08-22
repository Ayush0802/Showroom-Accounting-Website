import React, { useEffect, useState } from 'react';
import styles from './CustomerForm.module.css';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { base_url } from '../../assets/help';

function CustomerForm({ customerData, onSave, onClose }) {
    const [customer, setCustomer] = useState(customerData);

    useEffect(() => {
        document.body.style.backgroundColor = "grey";
        document.body.style.display = "";
        document.body.style.justifyContent = "";

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        updateAmounts();
    }, [customer.products, customer.amountPaidCash, customer.amountPaidBank, customer.discount, customer.transport]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleBillChange = (e) => {
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
            products: [...customer.products, { company: '', name: '', code: '', quantity: '', price: '', total: '' }],
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

        const transport = customer.transport;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(customer);
    };

    // useEffect(() => {
    //     axios.get(`${base_url}/addproduct`)
    //         .then(response => {
    //             const products = response.data;
    //             setProducts(products);

    //             axios.get(`${base_url}/addcompany`)
    //                 .then(companyResponse => {
    //                     const companies = companyResponse.data;
    //                     const structuredData = products.map(product => ({
    //                         name: product.name,
    //                         companies: product.companies.map(companyName => {
    //                             const company = companies.find(c => c.name === companyName);
    //                             return {
    //                                 name: companyName,
    //                                 catalogs: company ? company.catalogs : []
    //                             };
    //                         })
    //                     }));
    //                     console.log(structuredData.name)
    //                     setStructuredData(structuredData);
    //                 })
    //                 .catch(error => {
    //                     console.error("There was an error fetching companies:", error);
    //                 });
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching products:", error);
    //         });
    // }, []);
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


    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Edit Customer Portfolio : {customer.billno}</h1>
                <span className={styles.close} onClick={onClose}>&times;</span>
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
                            value={new Date(customer.date).toISOString().split('T')[0]}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Bill Number</label>
                        <input
                            type="number"
                            name="billno"
                            value={customer.billno}
                            onChange={handleBillChange}
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
                                placeholder="Product Code"
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
                <button className={styles.savebutton} type="submit">Save Changes</button>
            </form>
        </>
    );
}

export default CustomerForm;
