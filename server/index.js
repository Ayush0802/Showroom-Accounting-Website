const express = require('express')
const dotenv = require('dotenv').config()
const connectDb = require('./config/dbConnection')
const cors = require('cors')
const asynHandler = require('express-async-handler')
const User = require('./models/UserModel')
const Customer = require('./models/CustomerModel')
const Expense = require('./models/ExpenseModel')
const Payment = require('./models/PaymentModel')
const Dealer = require('./models/DealerModel')
const Product = require('./models/ProductModel')
const Company = require('./models/CompanyModel')
const Catalog = require('./models/CatalogModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

connectDb()
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())

app.use(cors({   
    origin:"https://showroom-accounts-web.vercel.app"
}))



// Registration Page //

app.post('/register',asynHandler(async (req,res)=>{
    const {username, email, password} = req.body
    if(!username || !email || !password){
        res.status(400).json({ message: "All fields required" });
        throw new Error("All fields required")
    }

    const available = await User.findOne({email}) 

    if(available){
        res.status(401).json({ message: "User already registered" });
        throw new Error("User already registered")
    }

    const hashpassword = await bcrypt.hash(password,10)
    const user = await User.create(
        {username,email,password : hashpassword}
    )

    console.log(user.email)
    res.json(user)
}))



// Login Page // 

app.post('/login', asynHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "All fields required" });
        throw new Error("All fields required");
    }

    const user = await User.findOne({ username });
    if (!user) {
        res.status(401).json({ message: "User Not Found" });
        throw new Error("User Not Found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ message: "Wrong Password" });
        throw new Error("Wrong Password");
    }

    try {
        const access_token = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 15, }
        );
        res.status(200).json({access_token, message: "Success" });
    } catch (error) {
        console.error('Error generating access token:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));



// New Customer Page //

// Create
app.post('/new-customer', async (req, res) => {
    try {
      const customerData = req.body;
      if (!customerData.name || !customerData.address || !customerData.contact || !customerData.billno || !customerData.date || !customerData.products || customerData.products.length === 0) {
        return res.status(400).json({ message: "All fields required" });
      }

      console.log(customerData.billno)
      const available = await Customer.findOne({ billno: customerData.billno }) 

      if(available){
        return res.status(401).json({ message: "Bill No. Already Exist" });
      }

      const newCustomer = new Customer(customerData);
  
      await newCustomer.save();
      return res.status(201).json({ message: 'Customer saved successfully' });
    } 
    catch (error) {
      
      console.error('Error saving customer data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



// Customers Page //

// Read
app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete
app.delete('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByIdAndDelete(id);
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update
app.put('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const customer = await Customer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Expenses page // 

// Read
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create
app.post('/expenses', async (req, res) => {
    const expenseData = req.body;
    const newPayment = new Expense(expenseData);

    try {
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update
app.put('/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const expense = await Expense.findByIdAndUpdate(id, updatedData, { new: true });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(expense);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete
app.delete('/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Payments Page //

// Create
app.post('/payments', async (req, res) => {
    const paymentData = req.body;
    const newPayment = new Payment(paymentData);

    try {
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Read
app.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete
app.delete('/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByIdAndDelete(id);
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Dealers Page //

// Create
app.post('/dealers', async (req, res) => {
    const dealerData = req.body;
    const newDealer = new Dealer(dealerData);

    try {
        await newDealer.save();
        res.status(201).json(newDealer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Read
app.get('/dealers', async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.json(dealers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete
app.delete('/dealers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dealer = await Dealer.findByIdAndDelete(id);
        
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }

        res.status(200).json({ message: 'Dealer deleted successfully' });
    } catch (error) {
        console.error('Error deleting dealer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update
app.put('/dealers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const dealer = await Dealer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }

        res.status(200).json(dealer);
    } catch (error) {
        console.error('Error updating dealer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Product //

// Read
app.get('/addproduct', async (req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create
app.post('/addproduct', async (req, res) => {
    const { name, companies } = req.body;
    let product = await Product.findOne({ name });

    if (product) {
        // Add new companies to the existing product
        product.companies = [...new Set([...product.companies, ...companies])];
    } else {
        // Create a new product if it doesn't exist
        product = new Product({ name, companies });
    }

    await product.save();
    res.send(product);
});



// Company //

// Read
app.get('/addcompany', async (req, res) => {
    try {
        const company = await Company.find();
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create
app.post('/addcompany', async (req, res) => {
    const { name, catalogs } = req.body;
    let company = await Company.findOne({ name });
    if (company) {
        // Add new catalogs to the existing company
        company.catalogs = [...new Set([...company.catalogs, ...catalogs])];
      } else {
        // Create a new company if it doesn't exist
        company = new Company({ name, catalogs });
      }

      await company.save();
      res.send(company);
});



// Price List Page

// Create
app.post('/catalogs', async (req, res) => {
    const catalog = new Catalog(req.body);
    try {
        const savedCatalog = await catalog.save();
        res.status(201).json(savedCatalog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read
app.get('/catalogs', async (req, res) => {
    try {
        const catalogs = await Catalog.find();
        res.json(catalogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete
app.delete('/catalogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const catalog = await Catalog.findByIdAndDelete(id);
        
        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }

        res.status(200).json({ message: 'Catalog deleted successfully' });
    } catch (error) {
        console.error('Error deleting catalog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update
app.put('/catalogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const catalog = await Catalog.findByIdAndUpdate(id, updatedData, { new: true });

        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }

        res.status(200).json(catalog);
    } catch (error) {
        console.error('Error updating catalog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Starting the Server
app.listen(port, ()=> console.log(`Server Started at PORT ${port}`))
