import editButton from '../assets/edit.png';
import deleteButton from '../assets/delete.png';
import starFull from '../assets/star_full.png';
import starEmpty from '../assets/star_empty.png';
import { Link } from 'react-router-dom';
import { useState, Fragment } from 'react';
import AddMovie from './AddMovie';
import ShowHideAddMovie from './ShowHideAddMovie';
import ExpandedMovieRow from './ExpandedMovieRow';
import { useMovies } from '../MovieContext';

export default function Movies() {
    const { movieData, deleteMovie } = useMovies();
    const [showTable, setShowTable] = useState(true);
    const [buttonText, setButtonText] = useState('Add Movie');
    // Store either null or the id of the expanded row
    const [expandedMovieId, setExpandedMovieId] = useState(null);

    // Updates showTable and buttonText when show / hide button pressed.
    function updateShow(showTable, buttonText) {
        setShowTable(showTable);
        setButtonText(buttonText);
    }

    // Change expandedMovieId to either null or a specified id when a tr is clicked below.
    function toggleExpand(id) {
        setExpandedMovieId(prev => (prev === id ? null : id));
    }

    // Loop 5 times and fill stars array with img elements of either a full or empty star 
    // depending on rating.
    function renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <img key={i} src={i <= rating ? starFull : starEmpty} className="star-icon img-fluid"
                    alt={rating} />
            );
        }
        return stars;
    }

    return (
        <div>
            <h3>Watched Movies</h3>
            {/* Show / Hide button that controls AddMovie form */}
            <div className="bg-rust text-rust-cream py-3 rounded-2 mt-3 mb-3 shadow-lg">
                <ShowHideAddMovie updateShow={updateShow} buttonText={buttonText} showTable={showTable} />
                {showTable ?
                    <></>
                    :
                    <AddMovie onMovieAdded={() => updateShow(true, 'Add Movie')} />
                }
            </div>
            <div className="rounded-3 overflow-auto border">
                <table className="table table-hover mb-0">
                    <thead className="bg-rust text-rust-cream">
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Year</th>
                            <th scope="col" className="rating-col">Rating</th>
                            <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* loop through movieData and populate table with movies */}
                        {movieData.map(movie => {
                            const isExpanded = expandedMovieId === movie.id;
                            return (
                                <Fragment key={movie.id}>
                                    {/* On click toggle that row's ID for expansion */}
                                    <tr onClick={() => toggleExpand(movie.id)}>
                                        <td>{movie.title}</td>
                                        <td>{movie.year}</td>
                                        <td className="">
                                            <div className="rating-stars">
                                                {renderStars(movie.star_rating)}
                                            </div>
                                        </td>
                                        <td>
                                            {/* Use stopPropagation() to prevent row from expanding when edit or delete are clicked. */}
                                            <Link to={`/edit/${movie.id}`} onClick={(e) => { e.stopPropagation(); }}>
                                                <img src={editButton} className='icon-btn action-icon img-fluid' alt='edit' />
                                            </Link>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); deleteMovie(movie.id); }} className='img-button'>
                                                <img src={deleteButton} className="icon-btn action-icon img-fluid" alt="delete" />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* If isExpanded is true render the expanded row */}
                                    {isExpanded && (
                                        <ExpandedMovieRow movie={movie} renderStars={renderStars} />
                                    )}
                                </Fragment>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
