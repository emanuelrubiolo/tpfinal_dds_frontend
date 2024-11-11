import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerDetails from "./pages/CustomerDetails";
import NewCustomer from "./pages/NewCustomer";
import NewSale from "./pages/NewSale";
import { CustomerProvider } from "./context/CustomerContext";
import Home from "./pages/Home";
import NewProduct from "./pages/NewProduct";
import NavBar from "./components/NavBar";
import NewLocation from "./pages/NewLocation";
import "./App.css";
import Locations from "./pages/Locations";
import Products from "./pages/Products";
import EditSale from "./pages/EditSale";

import { ProductProvider } from "./context/ProductContext";
import { LocationProvider } from "./context/LocationContext";

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
                <Route path="/customers/new" element={<NewCustomer />} />
                <Route path="/customers/:id" element={<CustomerDetails />} />
                <Route path="/customers/:id/edit" element={<NewCustomer />} />
                <Route
                  path="/customers/:customerId/new-sale"
                  element={<NewSale />}
                />

                <Route
                  path="/customers/:customerId/edit-sale/:saleId"
                  element={<EditSale />}
                />

                <Route path="/new-product" element={<NewProduct />} />
                <Route path="/new-location" element={<NewLocation />} />
                <Route path="/locations/:id/edit" element={<NewLocation />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id/edit" element={<NewProduct />} />
              </Routes>
            </div>
          </Router>
        </LocationProvider>
      </ProductProvider>
    </CustomerProvider>
  );
}

export default App;
