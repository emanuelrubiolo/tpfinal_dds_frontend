import React from 'react';
import { Button } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom'; 
import SearchCustomer from '../components/SearchCustomer';

const Home = () => {
  const navigate = useNavigate(); 
  return (
    <div>
      

      <SearchCustomer />
      
    </div>
  );
};

export default Home;
