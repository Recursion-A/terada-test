import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@freee_jp/vibes/css';
import PopularMovies from './components/PopularMovies'; 

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <PopularMovies />
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}

