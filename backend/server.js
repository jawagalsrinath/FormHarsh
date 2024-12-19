const express=require('express')
const mysql=require('mysql2')
const bodyParser=require('body-parser')
require('dotenv').config();


const app=express()
app.use(bodyParser.json());


const db=mysql.createConnection({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/employees', (req, res) => {
  const fetchQuery = 'SELECT * FROM employee';
  db.query(fetchQuery, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }
    res.status(200).json(results);
  });
});



app.post('/add',(req,res)=>{
  const { firstName, lastName, eId, email, phone, department, doj, role } = req.body;
 
  console.log('Received Data:', req.body);

  const checkQuery = 'SELECT * FROM employee WHERE email = ? OR eId = ?';
    db.query(checkQuery, [email, eId], (err, results) => {
      if (err) {
        console.error('Error during SELECT query:', err); // Log the error
        return res.status(500).json({ error: 'Database error during SELECT query' });
      }
  
      console.log('SELECT Query Results:', results);
  
      if (results.length > 0) {
        const existingField=results[0].email==email?'Email':'Employee ID';
        const message=`${existingField} already exists`;
        console.log('Duplicate Entry Detected');
        return res.status(400).json({ error: message });
      }
        const insertQuery = 'INSERT INTO employee (eId,firstName,lastName,email,phone,department,doj,workrole) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [eId, firstName,lastName, email, phone, department, doj, role], (err) => {

            if (err){
              console.error('Error during INSERT query:', err); 
              return res.status(500).json({ error: 'Database error' });
          
            } 
            console.log('Data inserted successfully');
            res.status(200).json({ message: 'Employee added successfully' });
        });
    });
})

app.put('/edit/:eId', (req, res) => {
  const eId = req.params.eId;
  const { firstName, lastName, email, phone, department, doj, workrole } = req.body;
 

  const checkQuery = 'SELECT * FROM employee WHERE eId = ?';
  db.query(checkQuery, [eId], (err, results) => {
    if (err) {
      console.error('Error during SELECT query:', err);
      return res.status(500).json({ error: 'Database error during SELECT query' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Employee ID does not exist' });
    }

    const updateQuery =
      'UPDATE employee SET firstName = ?, lastName = ?, email = ?, phone = ?, department = ?, doj = ?, workrole = ? WHERE eId = ?';
    db.query(updateQuery, [firstName, lastName, email, phone, department, doj, workrole, eId], (err) => {
      if (err) {
        console.error('Error during update query', err);
        return res.status(500).json({ error: 'Database error during UPDATE query' });
      }
      res.status(200).json({ message: 'Employee updated successfully' });
    });
  });
});


app.listen(8000, () => {
    console.log('Server is running');
});
