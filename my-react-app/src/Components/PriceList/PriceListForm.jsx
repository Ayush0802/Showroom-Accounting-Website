import React, { useState, useEffect } from 'react';
import styles from './PriceListForm.module.css';

const PriceListForm = ({ catalogData, onSave, onClose }) => {
    const [catalogs, setCatalogs] = useState({
        name: '',
        products: [{ name: '', mrp: '', dp:'' }],
        discount: '',
    });

    useEffect(() => {
        if (catalogData) {
            setCatalogs({
                ...catalogData,
            });
        } else {
            setCatalogs({
                name: '',
                products: [{ name: '', mrp: '', dp:''  }],
                discount: '',
            });
        }
    }, [catalogData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCatalogs({ ...catalogs, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...catalogs.products];
        newItems[index][name] = name === 'mrp' | 'dp' ? Number(value) : value;
        setCatalogs({ ...catalogs, products: newItems });   
    };

    const handleAddItem = () => {
        setCatalogs({
            ...catalogs,
            products: [...catalogs.products, { name: '', mrp: '', dp:''  }],
        });
    };

    const handleDeleteItem = (index) => {
        const newitems = [...catalogs.products];
        newitems.splice(index, 1);
        setCatalogs({ ...catalogs, products: newitems});
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(catalogs);
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{catalogData ? 'Edit Catalog' : 'Add Catalog'}</h2>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        className={styles.indate}
                        value={catalogs.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>Products:</label>
                {catalogs.products.map((product, index) => (
                    <div key={index} className={styles.itemRow}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="mrp"
                            placeholder="MRP"
                            value={product.mrp}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="dp"
                            placeholder="DP"
                            value={product.dp}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                        <button type="button" className={styles.deletebutton} onClick={() => handleDeleteItem(index)}>
                            Delete
                        </button>
                    </div>
                ))}
                <button type="button" className={styles.additembutton} onClick={handleAddItem}>
                    Add Product
                </button>
                <label>
                    Discount:
                    <input
                        type="number"
                        name="discount"
                        className={styles.indiscount}
                        value={catalogs.discount}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className={styles.bntcontainer}>
                    <button type="submit" className={styles.addexpensebutton}>
                        {catalogData ? 'Save Changes' : 'Add Catalog'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default PriceListForm;
