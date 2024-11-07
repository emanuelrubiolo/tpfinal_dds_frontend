import { createContext, useState } from 'react';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const addCustomer = (customer) => {
    setCustomers([...customers, customer]);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <CustomerContext.Provider value={{ customers, setCustomers, addCustomer, updateCustomer, selectedCustomer, selectCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};
