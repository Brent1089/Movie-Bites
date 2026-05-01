import { Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Home from './components/Home';
import Movies from './components/Movies';
import EditMovieWrapper from './components/EditMovie';
import Contact from './components/Contact';
import About from './components/About';
import Auth from './components/Auth';
import Register from './components/Register';
import { AuthProvider } from './AuthContext';
import { MovieProvider } from './MovieContext';
import { ToastProvider } from './ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MovieProvider>
          <div>
            <Nav />
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="movies" element={<Movies />} />
                <Route path="/edit/:id" element={<EditMovieWrapper />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </MovieProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
