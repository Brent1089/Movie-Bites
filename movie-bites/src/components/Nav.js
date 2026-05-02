import { NavLink, Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import Collapse from 'bootstrap/js/dist/collapse';
import { NavigationContext } from '../NavContext';
import { useAuth } from '../AuthContext';
import logo from '../assets/mblogo.png';

export default function Nav() {
    const navigation = useContext(NavigationContext);
    const { isLoggedIn, handleLogout } = useAuth();
    const location = useLocation();
    const navbarCollapseRef = useRef(null);

    function closeMobileNav() {
        const collapseElement = navbarCollapseRef.current;

        if (!collapseElement || !collapseElement.classList.contains('show')) {
            return;
        }

        const collapse = Collapse.getOrCreateInstance(collapseElement);
        collapse.hide();
    }

    useEffect(() => {
        closeMobileNav();
    }, [location.pathname]);

    function handleLogoutClick() {
        closeMobileNav();
        handleLogout();
    }

    return (
        <nav className="navbar navbar-expand-lg bg-rust" data-bs-theme="dark">
            <div className="container-fluid">
                <Link to="/">
                    <img src={logo} alt="Movie Bites" className="navbar-logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
                    aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div ref={navbarCollapseRef} className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav ms-auto text-center w-lg-auto">
                        {/* Loop through and populate Navbar */}
                        {navigation.map((item, idx) => (
                            <li key={idx} className="nav-item">
                                <NavLink to={item.link} className="nav-link text-rust-light text-rust-hover px-3 rounded-2 nav-hover">
                                    {item.text}
                                </NavLink>
                            </li>
                        ))}
                        {/* Auth buttons - show Login/Register when not logged in, Logout when logged in */}
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link text-rust-light text-rust-hover px-3 rounded-2 nav-hover">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link text-rust-light text-rust-hover px-3 rounded-2 nav-hover">
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button onClick={handleLogoutClick} className="nav-link auth-nav-button text-rust-light text-rust-hover px-3 rounded-2 nav-hover bg-transparent border-0">
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                    <form className="d-flex">
                    </form>
                </div>
            </div>
        </nav>
    );
}
