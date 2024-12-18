import 'typeface-roboto-condensed';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from './redux/store'; // Import both store and persistor
import Login from './components/Login/login';
import Information from './components/Company_Input/companyPage';
import Dashboard from './components/Dashboard/home';
import Register from './components/Register/register';
import { SERVER_URL } from './config';
import AuthToken from './components/Login/AuthToken';
// import UserProvider from './UserContext';
function App() {
  console.log(SERVER_URL);
  const [companyInfoCompleted, setCompanyInfoCompleted] = useState(false);
  const [authTrue, setAuthTrue] = useState(false);

  useEffect(() => {
    // Make API call to check company info status
    axios.get(`${SERVER_URL}auth-cmp-reg/`)
      .then(response => {
        setCompanyInfoCompleted(response.data.status);
      })
      .catch(error => {
        console.error("There was an error checking company info status", error);
      })
    axios.get(`${SERVER_URL}auth-vrf/`)
      .then(response => {
        setAuthTrue(response.data.status);
      })
      .catch(error => {
        console.error("There was an error checking auth token status", error);
      })
  }, []);

  const renderHome = () => {
    if (authTrue) {
      return <AuthToken />;
    } else if (!companyInfoCompleted) {
      return <Information />;
    } else {
      return <Login />;
    }
  };

  
  return (
    
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Register />} />
          <Route path="/companyInformation" element={<Information />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/access" element={<AuthToken />} /> */}



          {/* <Route path="/companyInformation" element={!companyInfoCompleted ?  <Information /> : <Navigate to="/" /> }/> */}
          {/* <Route path="/" element={<Login />} /> */}
          {/* <Route path="/" element={ !authTrue ? <AuthToken/> :  <Login />} /> */}
          <Route path="/" element={ renderHome()} />
          <Route path="/Signup" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      </PersistGate>
      
    </Provider>
  );
}

export default App;
