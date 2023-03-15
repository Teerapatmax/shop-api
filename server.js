const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: '157.245.59.56',
  user: 'u6403198',
  password: '6403198',
  database: 'u6403198_shopee',
  port: 3366
})

var app = express()
app.use(cors())
app.use(express.json())

app.get('/', function(req, res) {
  res.json({
    "status": "ok",
    "message": "Hello World"
  })
})

app.get('/customer', function(req, res) {
  connection.query(
    'SELECT * FROM a1_customer',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

app.get('/order', function(req, res) {
  connection.query(
    'SELECT * FROM a1_order',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

app.get('/product', function(req, res) {
  connection.query(
    'SELECT * FROM a1_product',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})
// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get("/top_customer", function (req, res) {
  connection.query(
    `SELECT 
    C.firstName, 
    SUM(O.QTY*P.price) AS price_sum 
  FROM a1_customer AS C 
    INNER JOIN a1_order AS O ON C.Cid = O.Cid
    INNER JOIN a1_product AS P ON O.Pid = P.Pid
  GROUP BY 
    C.Cid
  ORDER BY 
    price_sum DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get('/top_product', function(req, res){
  connection.query(
    `SELECT O.id, P.PName, O.QTY, SUM(O.QTY*P.price) as Total_QTY FROM a1_order as O INNER JOIN a1_Product as P ON O.Pid = P.Pid GROUP BY O.id, P.PName, O.QTY, P.price ORDER BY Total_QTY DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});


app.post("/createuser", function (req, res) {
  const Firstname = req.body.Firstname;
  const Lastname = req.body.Lastname;
  const Email = req.body.Email;
  const Gender = req.body.Gender;
  const Tel = req.body.Tel;
  const Age = req.body.Age;
  const Address = req.body.Address;
  connection.query(
    `INSERT INTO a1_customer (firstName, lastName, phone, address, email) VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, phone, address, email],
    function (err, results) {
      if (err) {
        res.json(err);
      }
      res.json(results);
    }
  );
});

app.post('/order', function(req, res) {
  const values = req.body
  console.log(values)
  connection.query(
    'INSERT INTO a1_Order (Oid, Pid, Cid, QTY) VALUES ?', [values],
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})


app.listen(5000, () => {
  console.log("Server is started.");
});