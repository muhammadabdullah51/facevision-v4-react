import 'typeface-roboto-condensed';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from './redux/store'; // Import both store and persistor
import Login from './components/Login/login';
import Information from './components/Company_Input/companyPage';
import Dashboard from './components/Dashboard/home';
import Register from './components/Register/register';
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Register />} />
          <Route path="/companyInformation" element={<Information />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      </PersistGate>
      
    </Provider>
  );
}

export default App;
