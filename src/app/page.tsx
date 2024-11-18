"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SkeletonMovieCard from "./components/SkeletonCard";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

export default function MovieMagicPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadOops, setLoadOops] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isScrollLoading, setIsScrollLoading] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const summonMoreMovies = async () => {
      setIsFirstLoad(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${pageNumber}`
        );
        if (!res.ok) throw new Error("Oopsie! Movie data did not load");
        const data = await res.json();

        const uniqueMovies = data.results.filter(
          (newMovie: Movie) => !movies.some((movie) => movie.id === newMovie.id)
        );

        setMovies((prevMovies) => [...prevMovies, ...uniqueMovies]);
      } catch {
        setLoadOops("Failed to load movies. Try reloading?");
      } finally {
        setIsFirstLoad(false);
        setIsScrollLoading(false);
      }
    };

    summonMoreMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    const handleLazyScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !isScrollLoading
      ) {
        setPageNumber((prevPage) => prevPage + 1);
        setIsScrollLoading(true);
      }
    };

    window.addEventListener("scroll", handleLazyScroll);
    return () => window.removeEventListener("scroll", handleLazyScroll);
  }, [isScrollLoading]);

  const screenMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (movie: Movie) => {
    const updatedFavorites = favorites.some((fav) => fav.id === movie.id)
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  if (loadOops) {
    return <div>{loadOops}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">🎬 Epic Movie Collection</h1>

      <input
        type="text"
        placeholder="Find your favorite flick…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <Link href="/favorites">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          Go to Favorites
        </button>
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isFirstLoad && pageNumber === 1
          ? Array.from({ length: 8 }).map((_, index) => (
              <SkeletonMovieCard key={index} />
            ))
          : screenMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 text-white p-4 rounded transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                <Link href={`/movie/${movie.id}`}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} Poster`}
                    width={500}
                    height={750}
                    className="w-full h-auto mb-2 rounded"
                  />
                  <h2 className="text-lg font-semibold">{movie.title}</h2>
                  <p>📅 Release: {movie.release_date}</p>
                  <p>⭐ Rating: {movie.vote_average}</p>
                </Link>

                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`mt-2 px-4 py-2 w-full rounded transition-all duration-300 ${
                    favorites.some((fav) => fav.id === movie.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-800 hover:bg-yellow-500 hover:text-black"
                  }`}
                >
                  {favorites.some((fav) => fav.id === movie.id)
                    ? "❤️ Remove from Favourites"
                    : "🤍 Favorite"}
                </button>
              </div>
            ))}
      </div>

      {isScrollLoading && <div>🍿 Loading more hits…</div>}
    </div>
  );
}
