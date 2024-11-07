
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDetails from './pages/CustomerDetails';
import NewCustomer from './pages/NewCustomer';
import NewSale from './pages/NewSale';
import { CustomerProvider } from './context/CustomerContext';
import Home from './pages/Home';
import NewProduct from './pages/NewProduct';
import NavBar from './components/NavBar'; 
import NewLocation from './pages/NewLocation';


import { ProductProvider } from './context/ProductContext'; 
import { LocationProvider } from './context/LocationContext';

function App() {
  return (
    <CustomerProvider>
      <ProductProvider> 
      <LocationProvider>
        <Router>
          <div>
          <NavBar /> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/customers/:customerId/new-sale" element={<NewSale />} />
              <Route path="/customers/new" element={<NewCustomer />} />
              <Route path="/customers/:id/edit" element={<NewCustomer />} />
              <Route path="/new-product" element={<NewProduct />} />
              <Route path="/new-location" element={<NewLocation />} />
            </Routes>
          </div>
        </Router>
        </LocationProvider>
      </ProductProvider>
    </CustomerProvider>
  );
}

export default App;
