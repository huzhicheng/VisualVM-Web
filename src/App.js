import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import About from './components/About';
import Home from './components/Home';
import Domain from './components/beans/Domain';


function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/jmx' element={<MainLayout />}>
            <Route index element={<Home />}></Route>
            <Route path='domain' element={<Domain />}></Route>
            <Route path='about' element={<About />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
