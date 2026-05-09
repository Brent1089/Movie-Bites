// src/MovieContext.js
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { apiBaseUrl } from './apiConfig';

const MovieContext = createContext();

const apiUrl = `${apiBaseUrl}/movies`;

/**
 * Pulls a message from an API error.
 */
const getErrorMessage = (error, fallback) => {
  return error.response?.data?.error || error.response?.data?.status || error.message || fallback;
};

/**
 * Provides movie data, loading/error state, and CRUD actions to child components.
 *
 * Movie data is refreshed when the authenticated user changes so the list stays
 * scoped to the current session.
 */
export function MovieProvider({ children }) {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const { isLoggedIn, user } = useAuth();

  /**
   * Fetches movies for the current session and stores them in context state.
   */
  const getMovieData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(apiUrl, {
        withCredentials: true
      });
      setMovieData(res.data);
    } catch (err) {
      setError(err);
      console.error(err);
      showToast(getErrorMessage(err, 'Could not load movies.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  /**
   * Creates a movie through the API and appends it to the movie list.
   */
  async function addMovie(newMovieData) {
    try {
      const res = await axios.post(apiUrl, newMovieData, {
        withCredentials: true
      });

      setMovieData(prev => [...prev, res.data]);
      showToast('Movie added.', 'success');
      return res.data;
    } catch (err) {
      showToast(getErrorMessage(err, 'Movie could not be added.'), 'error');
      throw err;
    }
  }

  /**
   * Updates a movie through the API and replaces it in local state.
   */
  async function updateMovie(updatedMovie) {
    try {
      const res = await axios.put(`${apiUrl}/${updatedMovie.id}`, updatedMovie, {
        withCredentials: true
      });

      setMovieData(prev =>
        prev.map(movie =>
          movie.id === updatedMovie.id ? res.data : movie
        )
      );

      showToast('Movie updated.', 'success');
      return res.data;
    } catch (err) {
      showToast(getErrorMessage(err, 'Movie could not be updated.'), 'error');
      throw err;
    }
  }

  /**
   * Deletes a movie through the API and removes it from local state.
   */
  async function deleteMovie(id) {
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        withCredentials: true
      });
      setMovieData(prev => prev.filter(movie => movie.id !== id));
      showToast('Movie deleted.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Movie could not be deleted.'), 'error');
      throw err;
    }
  }

  useEffect(() => {
    getMovieData();
  }, [getMovieData, isLoggedIn, user?.id]);

  return (
    <MovieContext.Provider
      value={{
        movieData,
        loading,
        error,
        getMovieData,
        addMovie,
        updateMovie,
        deleteMovie
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

/**
 * Reads movie list state and movie CRUD handlers from MovieContext.
 */
export function useMovies() {
  return useContext(MovieContext);
}
