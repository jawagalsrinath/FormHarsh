import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Table = () => {
    const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://employee-form-welg.onrender.com/employees');
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to fetch employee data');
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    navigate('/edit', { state: { employee } });
  };

  return (
    <div>
      <h1>Employee List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.eId}>
              <td>{employee.eId}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.department}</td>
              <td>{new Date(employee.doj).toLocaleDateString()}</td>             
              <td>{employee.workrole}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={()=>navigate('/')}>Add employee</button>
      
    </div>
    
  );
};

export default Table
