import logo from '../assets/mblogo.png';
import tickets from '../assets/tickets_banner.jpg'


export default function Home() {
    return(
        <div>
            <img src={tickets} alt='movie tickets' className='img-fluid mb-3 shadow' />
            <h3>Welcome to Movie Bites!</h3>
            <div className="bg-rust text-rust-cream py-3 rounded-2 mt-3">
                <p className="m-0">Get your popcorn ready!</p>
            </div>
            <div className="rounded-2 border border-secondary py-3 mt-3 w-75 mx-auto shadow-lg bg-blur">
                <p className="mx-3">
                    Movie Bites is your personal hub for exploring movies, managing what you've watched, and discovering what to enjoy next. 
                    Browse reviews, track your watchlist, and rate films to build your own collection of favorites. Learn more about how the 
                    site works in the About section, or reach out anytime through our Contact page. Whether you're a casual viewer or a passionate 
                    film fanatic, Movie Bites makes it easier to keep your movie life organized and enjoyable.
                </p>
            </div>
            <img src={logo} alt='movie bites logo' width='200px' className='img-thumbnail mb-3 shadow bg-rust rounded-2 mt-3' />
        </div>
    );
}