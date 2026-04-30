import logo from '../assets/mblogo.png';
import theater from '../assets/theater.jpg'

export default function About() {
    return (
        <div>
            <img src={theater} alt='theater seating' className='img-fluid mb-3 shadow' />
            
            <div className="bg-rust text-rust-cream py-3 rounded-2 mt-3">
                <h3>About Me</h3>
                <div className="rounded-2 border border-secondary py-3 mt-3 w-75 mx-auto shadow-lg bg-blur text-black">
                    <ul>
                        <li><strong>Name: </strong> Brent Deutscher</li>
                        <li><strong>Occupation: </strong> Student </li>
                        <li><strong>Email: </strong><a href="mailto:deutschb4@mail.gtc.edu">deutschb4@mail.gtc.edu</a></li>
                        <li><strong>Portfolio: </strong><a href="https://prometheus.gtc.edu/~bdeutscher/">https://prometheus.gtc.edu/~bdeutscher/</a></li>
                        <li>I am a second year student at Gateway Technical College.</li>
                    </ul>
                </div>
            </div>

            <img src={logo} alt='movie bites logo' width='200px' className='img-thumbnail mb-3 shadow bg-rust rounded-2 mt-3' />
        </div>
    );
}
