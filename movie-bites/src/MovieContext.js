// src/MovieContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const MovieContext = createContext();

const apiUrl = 'http://localhost:5000/movies';

export function MovieProvider({ children }) {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getMovieData() {
    try {
      setLoading(true);
      const res = await axios.get(apiUrl);
      setMovieData(res.data);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addMovie(newMovieData) {
    const res = await axios.post(apiUrl, newMovieData);

    // Prefer backend response here, because it probably includes the new id.
    setMovieData(prev => [...prev, res.data]);
    return res.data;
  }

  async function updateMovie(updatedMovie) {
    const res = await axios.put(`${apiUrl}/${updatedMovie.id}`, updatedMovie);

    setMovieData(prev =>
      prev.map(movie =>
        movie.id === updatedMovie.id ? res.data : movie
      )
    );

    return res.data;
  }

  async function deleteMovie(id) {
    await axios.delete(`${apiUrl}/${id}`);
    setMovieData(prev => prev.filter(movie => movie.id !== id));
  }

  async function deleteAllMovies() {
    await axios.delete(apiUrl);
    setMovieData([]);
  }

  useEffect(() => {
    getMovieData();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        movieData,
        loading,
        error,
        getMovieData,
        addMovie,
        updateMovie,
        deleteMovie,
        deleteAllMovies
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  return useContext(MovieContext);
}
