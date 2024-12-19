import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import '../App.css'
const initialFormData = {
    firstName: '',
    lastName: '',
    eId: '',
    email: '',
    phone: '',
    department: 'HR',
    doj: '',
    role: '',
  };

const Form=()=>{ 
  const navigate=useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const handleReset = () => {
    setFormData(initialFormData); // Reset formData to initial state
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const validateField = (name, value) => {
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
    }
    if (name === 'phone' && !/^\d{10}$/.test(value)) {
        return 'Phone number must be 10 digits';
    }
    if (name === 'eId' && value.length > 10) {
        return 'Employee ID must not exceed 10 characters';
    }
    if (name === 'doj' && new Date(value) > new Date()) {
      return 'Date of Joining cannot be in the future';
  }
    return '';
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(''); // Clear previous server errors

    // Check for frontend errors before submitting
    const formErrors = {};
    if (!emailRegex.test(formData.email)) formErrors.email = 'Invalid email format';
    if (!phoneRegex.test(formData.phone)) formErrors.phone = 'Phone number must be 10 digits';
    if (formData.eId.length > 10) formErrors.eId = 'Employee ID must not exceed 10 characters';

    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }

    try {
        const response = await axios.post("http://localhost:8000/add", formData);
        console.log(response.data);
        alert('Employee added successfully!');
        navigate('/employees')
    } catch (error) {
        if (error.response && error.response.data.error) {
            setServerError(error.response.data.error);
        } else {
            setServerError('Something went wrong. Please try again.');
        }
    }
  };
  return(
    <form onSubmit={handleSubmit}>
        {serverError && <p style={{ color: 'red', fontWeight: 'bold' }}>{serverError}</p>}
        <div>
            <label>Employee First Name:</label>
            <input type="text" name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder='First Name' required 
            />
        </div>

        <div>
            <label>Employee Last Name:</label>
            <input type="text" name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder='Last Name' required 
            />
        </div>

        <div>
            <label>Employee ID:</label>
            <input type="text" name="eId"
            value={formData.eId}
            onChange={handleChange}
            placeholder='Employee ID' required 
            />
            
        </div>

        <div>
            <label>Email:</label>
            <input type="email" name="email"
            value={formData.email}
            onChange={handleChange} 
            placeholder='Email' required 
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
            <label>Phone number:</label>
            <input type="number" name="phone"
            value={formData.phone}
            onChange={handleChange}      
            placeholder='Phone number' required 
            />
            {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
        </div>

        <div>
            <label>Department:</label>
            <select name="department" value={formData.department}
                    onChange={handleChange} required
                >
                <option value='HR'>HR</option>
                <option value='Engineering'>Engineering</option>
                <option value='Management'>Management</option>
            </select>
        </div>

        <div>
            <label>Date of Joining:</label>
            <input type="text" name="doj"
             value={formData.doj}
             onChange={handleChange}             
            placeholder='YYYY-MM-DD' required 
            />
            {errors.doj && <p style={{ color: 'red' }}>{errors.doj}</p>}
        </div>

        <div>
            <label>Role:</label>
            <input type="text" name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder='Employee Role' required 
            />
        </div>
        <div className='buttons'>
            <button type='submit'>Submit</button>
            <button
          type="button" 
          onClick={handleReset}
        >
          Reset
        </button>
        </div>
        

        
    </form>
  )  
}

export default Form;