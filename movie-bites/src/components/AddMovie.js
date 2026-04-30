import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateMovieData } from "../utils/movieValidation";
import { useMovies } from "../MovieContext";

export default function AddMovie() {
    const navigate = useNavigate();
    const { addMovie } = useMovies();
    const [errors, setErrors] = useState({});
    const [movie, setMovie] = useState({
        title: "",
        year: "",
        genre: "",
        age_rating: "",
        description: "",
        poster_url: "",
        star_rating: "",
        comment: ""
    });

    // Update state on input change
    function handleChange(event) {
        const { name, value } = event.target;
        setMovie(prevMovie => ({ ...prevMovie, [name]: value }));
    }

    // Validate input and submit for / show errors.
    async function handleSubmit(event) {
        event.preventDefault();
        const newErrors = validateMovieData(movie);

        // If errors exist, add errors to state and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear errors and send update request and redirect
        setErrors({});
        try {
            await addMovie(movie);
            navigate('/movies');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='container p-4 text-start bg-rust rounded-2 text-rust-cream'>
            <h2 className="text-center">Add Movie</h2>
            <form onSubmit={handleSubmit}>
                <div className='row mb-3'>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Title: </label>
                        <input type='text' className="form-control" name='title' value={movie.title} onChange={handleChange} />
                        {/* display any errors under the input */}
                        {errors.title && <p className="text-primary">{errors.title}</p>}
                    </div>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Year: </label>
                        <input type='text' className="form-control" name='year' value={movie.year} onChange={handleChange} />
                        {errors.year && <p className="text-primary">{errors.year}</p>}
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Genre: </label>
                        <input type='text' className="form-control" name='genre' value={movie.genre} onChange={handleChange} />
                        {errors.genre && <p className="text-primary">{errors.genre}</p>}
                    </div>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Age Rating: </label>
                        <input type='text' className="form-control" name='age_rating' value={movie.age_rating} onChange={handleChange} />
                        {errors.age_rating && <p className="text-primary">{errors.age_rating}</p>}
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Description: </label>
                        <textarea className="form-control" name='description' value={movie.description} onChange={handleChange} rows="3" />
                        {errors.description && <p className="text-primary">{errors.description}</p>}
                    </div>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Comment: </label>
                        <textarea className="form-control" name='comment' value={movie.comment} onChange={handleChange} rows="3" />
                        {errors.comment && <p className="text-primary">{errors.comment}</p>}
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Star Rating: </label>
                        <input type='text' className="form-control" name='star_rating' value={movie.star_rating} onChange={handleChange} />
                        {errors.star_rating && <p className="text-primary">{errors.star_rating}</p>}
                    </div>
                    <div className='col'>
                        <label className="form-label me-2 mb-1">Poster URL: </label>
                        <input type='text' className="form-control" name='poster_url' value={movie.poster_url} onChange={handleChange} />
                        {errors.poster_url && <p className="text-primary">{errors.poster_url}</p>}
                    </div>
                </div>
                {/* Render if a url exists and it starts with http */}
                {movie.poster_url && movie.poster_url.startsWith('http') && (
                    <div className="row mb-3">
                        <div className="col text-center">
                            <label className="form-label d-block mb-2">Poster Preview:</label>
                            <img src={movie.poster_url} alt="Poster Preview" className="img-fluid rounded border border-rust poster-thumbnail"
                                // Hide the image on error to prevent glitchy UI
                                onError={(e) => e.target.style.display = 'none'}
                                onLoad={(e) => e.target.style.display = 'inline-block'} />
                        </div>
                    </div>
                )}
                <div className="text-center">
                    <button type='submit' className='btn btn-rust mt-4 mb-3'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
