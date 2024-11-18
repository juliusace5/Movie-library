"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (movieId: number) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist changes
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🎬 Your Favorite Movies</h1>

      {favorites.length === 0 ? (
        <p className="text-center">
          No favorites yet. Add some movies from the collection!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-lg"
            >
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} Poster`}
                  width={500}
                  height={750}
                  className="w-full h-auto mb-4 rounded-lg"
                />
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p>📅 Release: {movie.release_date}</p>
                <p>⭐ Rating: {movie.vote_average}</p>
              </Link>

              <button
                onClick={() => removeFavorite(movie.id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
