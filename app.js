const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 5000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'giant',
  password: 'Bmw.gentleman',
  database: 'tastebites',
  authPlugin: 'mysql_native_password',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
      // SQL query to create the 'foods' table
    const createFoodsTableQuery = `
      CREATE TABLE IF NOT EXISTS foods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255)
      )
    `;
  
    // Execute the query to create the 'foods' table
    db.query(createFoodsTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating foods table: ' + err.stack);
        return;
      }
      console.log('Foods table created successfully');
      // Close the connection after the query is executed (optional)
      // db.end();
    }); 
  // SQL query to insert sample data into the 'foods' table
  // const insertSampleDataQuery = `
  //   INSERT INTO foods (title, price, image) VALUES
  //     ('Shawarma', 200.00, '/images/food1.png'),
  //     ('Stir Fry', 300.00, '/images/food2.png'),
  //     ('Burger', 180.00, '/images/food3.png'),
  //     ('Pizza', 250.00, '/images/food4.png'),
  //     ('Chicken', 200.00, '/images/food5.png'),
  //     ('Fried Rice', 300.00, '/images/food6.png'),
  //     ('Fried Chicken', 180.00, '/images/food7.png'),
  //     ('Chicken Salad', 250.00, '/images/food8.png'),
  //     ('Chicken Wings', 200.00, '/images/food9.png'),
  //     ('Chicken Burger', 300.00, '/images/food10.png'),
  //     ('Chicken Shawarma', 180.00, '/images/food11.png'),
  //     ('Sushi Roll', 320.00, '/images/food12.png')
  // `;

  // // Execute the query to insert sample data into the 'foods' table
  // db.query(insertSampleDataQuery, (err, result) => {
  //   if (err) {
  //     console.error('Error inserting sample data: ' + err.stack);
  //     return;
  //   }
  //   console.log('Sample data inserted into the foods table successfully');

  //   // Close the connection after the query is executed (optional)
  //   // db.end();
  // }); 
});



// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
// Set up session middleware
app.use(session({
  secret: 'giantiss', // Change this to a secret string
  resave: false,
  saveUninitialized: true
}));
// Set up view engine
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));
app.use('/fonts', express.static(__dirname + 'public/fonts'));
app.use('/vendor', express.static(__dirname + 'public/vendor'));
app.use('/scss', express.static(__dirname + 'public/scss'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/menu', (req, res) => {
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
      }
      console.log('Connected to MySQL as id ' + db.threadId);
  
      const selectSampleDataQuery = `SELECT * FROM foods`;
  
      db.query(selectSampleDataQuery, (err, results) => {
        if (err) {
          console.error('Error selecting sample data: ' + err.stack);
          return;
        }
  
        console.log('Sample data from the foods table:');
        console.table(results); // Display the results in a table format
  
        // Render the menu.ejs template and pass the fetched data
        res.render('menu', { foods: results });
  
        // Close the connection after rendering the template (optional)
        // db.end();
      });
    });
  });

app.post('/add-to-cart', (req, res) => {
  const { foodId, title, price } = req.body;

  // Retrieve the cart items from the session or initialize an empty array
  const cartItems = req.session.cartItems || [];

  // Add the new item to the cart with a quantity of 1
  cartItems.push({ foodId, title, price, quantity: 1 });

  // Save the updated cart items back to the session
  req.session.cartItems = cartItems;

  // Respond with success status
  res.sendStatus(200);
});
  
  
app.get('/cart', (req, res) => {
  const cartItems = req.session.cartItems || [];
  res.render('cart', { cartItems });
});
  
app.post('/remove-item/:index', (req, res) => {
  try {
      const index = req.params.index;
      
      // console.log('Received index:', index);
      // console.log('Cart items before removal:', req.session.cartItems);

      if (req.session.cartItems && req.session.cartItems.length > index) {
          req.session.cartItems.splice(index, 1);
      } else {
          throw new Error('Invalid index or cartItems array');
      }

      // console.log('Cart items after removal:', req.session.cartItems);

      res.redirect('/cart');
  } catch (error) {
      console.error('Error removing item:', error);
      res.status(500).send('Internal Server Error');
  }
});

//other routes and configurations...


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
