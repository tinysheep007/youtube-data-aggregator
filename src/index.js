import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/HeaderStyle.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MainPage from './pages/MainPage';
import SearchByLink from "../src/components/SearchByLink.jsx";
import BatchSearch from './components/BatchSearch.jsx';
import BatchSearchLink from './components/BatchSearchLink.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='header'>
        <Link to="/s">Channel Name Search</Link>
        <Link to="/link">Channel Link Search</Link>
        <Link to="/bs">Batch Search By Names</Link>
        <Link to="/bl">Batch Search By Links</Link>
      </div>

      <Routes>
        <Route path='/bl' element={<BatchSearchLink />}/>
        <Route path='/bs' element={<BatchSearch />}/>
        <Route path="/link" element={<SearchByLink />}/>
        <Route path="/s" element={<App/>} />
        <Route path="/" element={<MainPage />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
