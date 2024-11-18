"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MovieDetails {
  title: string;
  poster_path: string;
  overview: string;
  genres: { name: string }[];
  release_date: string;
  vote_average: number;
  cast?: { name: string; character: string; profile_path?: string }[];
}

interface CastMember {
  name: string;
  character: string;
  profile_path?: string;
}

interface MoviePageProps {
  params: { id: string };
}

const MovieDetailsPage = ({ params }: MoviePageProps) => {
  const { id } = params;
  const [movieInfo, setMovieInfo] = useState<MovieDetails | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const grabMovieDetails = async () => {
      setIsPageLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits`
        );

        if (!res.ok) throw new Error("Failed to fetch movie details");
        const data = await res.json();

        const castData: CastMember[] = data.credits.cast.map(
          (member: CastMember) => ({
            name: member.name,
            character: member.character,
            profile_path: member.profile_path,
          })
        );

        setMovieInfo({ ...data, cast: castData });
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    grabMovieDetails();
  }, [id]);

  if (isPageLoading) {
    return <div>🎬 Hold tight, fetching movie magic…</div>;
  }

  if (!movieInfo) {
    return <div>Oops, no movie found! 🍿</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">{movieInfo.title}</h1>
      <div className="flex flex-col items-center">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`}
          alt={`${movieInfo.title} Poster`}
          width={400}
          height={600}
          className="rounded-lg shadow-lg mb-6"
        />
        <div className="text-white text-center space-y-4 max-w-2xl">
          <p className="text-lg">{movieInfo.overview}</p>
          <p>
            <strong>Release Date:</strong> {movieInfo.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movieInfo.vote_average}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movieInfo.genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>
      </div>

      {movieInfo.cast && (
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-center">Cast</h2>
          <ul className="flex flex-wrap justify-center gap-6">
            {movieInfo.cast.map((actor, idx) => (
              <li
                key={idx}
                className="flex flex-col items-center text-center space-y-2"
              >
                {actor.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    width={80}
                    height={120}
                    className="rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-20 h-30 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-semibold">{actor.name}</p>
                  <p className="text-gray-400">as {actor.character}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
