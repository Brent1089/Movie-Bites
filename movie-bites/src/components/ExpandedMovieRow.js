export default function ExpandedMovieRow({ movie, renderStars }) {
    return (
        <tr className="expanded-movie-row">
            <td colSpan={5} className="expanded-movie-cell">
                <div className="expanded-movie-card rounded-2 border border-secondary-emphasis p-3 shadow-sm text-start">
                    <div className="expanded-movie-content d-flex gap-3 align-items-center">
                        <img src={movie.poster_url} alt={movie.title + " poster"}
                            className="rounded-4 poster-thumbnail border border-4 border-rust" />
                        <div className="flex-grow-1">
                            <p className="mb-2"><strong>Title:</strong> {movie.title}</p>
                            <p className="mb-2"><strong>Year:</strong> {movie.year}</p>
                            <p className="mb-2"><strong>Genre:</strong> {movie.genre}</p>
                            <p className="mb-2"><strong>Age Rating:</strong> {movie.age_rating}</p>
                            <p className="mb-2"><strong>Description:</strong></p>
                            <p className="text-start">{movie.description}</p>
                            {/* Show comment only if a comment exists. */}
                            {movie.comment && (
                                <>
                                    <p className="mb-2 mt-3"><strong>Comment:</strong></p>
                                    <p className="text-start">{movie.comment}</p>
                                </>
                            )}
                            <p className="mb-2"><strong>Rating: </strong> {renderStars(movie.star_rating)}</p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}
