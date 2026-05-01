// src/MovieContext.js
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const MovieContext = createContext();

const apiUrl = 'http://localhost:5000/movies';

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.error || error.response?.data?.status || error.message || fallback;
};

export function MovieProvider({ children }) {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const { isLoggedIn, user } = useAuth();

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

  async function deleteAllMovies() {
    try {
      await axios.delete(apiUrl, {
        withCredentials: true
      });
      setMovieData([]);
      showToast('Movies deleted.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Movies could not be deleted.'), 'error');
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

export function useMovies() {
  return useContext(MovieContext);
}
