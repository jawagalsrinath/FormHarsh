import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './Components/Form';
import Table from './Components/Table';
import EditForm from './Components/Editform'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/employees" element={<Table />} />
        <Route path="/edit" element={<EditForm />} />
      </Routes>
    </Router>
  );
};

export default App;