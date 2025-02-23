import { useEffect, useState } from "react";
import useData from "../Hooks/useData";
import { GoHeart, GoHeartFill } from "react-icons/go";
import SearchBar from "./SearchBar";

interface Movie {
  id: number;
  original_title: string;
  poster_path: string;
  release_date: string;
}

const MovieCard = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);
  const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectedLikedMovies, setSelectedLikedMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isLoading } = useData<Movie>("/movie/now_playing");
  const {
    data: searchData,
    error: searchError,
    isLoading: searchLoading,
  } = useData<Movie>(searchQuery ? `/search/movie?query=${searchQuery}` : null);

  useEffect(() => {
    if (data) {
      setMovies(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData);
    }
  }, [searchData]);

  const toggleLiked = (movieId: number, movie: Movie) => {
    setLikedMovies((prevLikedMovies) => ({
      ...prevLikedMovies,
      [movieId]: !prevLikedMovies[movieId],
    }));

    setSelectedLikedMovies((prevSelectedMovies) =>
      likedMovies[movieId]
        ? prevSelectedMovies.filter((m) => m.id !== movieId)
        : [...prevSelectedMovies, movie]
    );
  };

  const toggleLikedMovies = () => {
    setAllMovies(!allMovies);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  if (error || searchError) {
    return <p>An unknown error has occurred</p>;
  }

  if (isLoading || searchLoading) {
    return <div>Loading....</div>;
  }

  const displayedMovies = searchQuery.length > 0 ? searchResults : movies;

  return (
    <div className="pt-28">
      <div className="flex justify-center items-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      <button
        className="px-4 py-2 ml-10 border border-l-indigo-500 border-r-indigo-500 border-t-indigo-700 border-b-indigo-600 hover:bg-indigo-800 rounded-2xl cursor-pointer"
        onClick={toggleLikedMovies}
      >
        {allMovies ? "Liked Movies" : "All Movies"}
      </button>

      {allMovies ? (
        <div className="pt-20 px-10">
          <ul className="grid grid-cols-4 gap-8">
            {displayedMovies.length > 0 ? (
              displayedMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="cursor-pointer relative"
                  onMouseEnter={() => setHoveredMovieId(movie.id)}
                  onMouseLeave={() => setHoveredMovieId(null)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.original_title}
                    className="w-full"
                  />
                  <div className="flex flex-col">
                    <div>{movie.original_title}</div>
                    <div>{movie.release_date}</div>
                  </div>
                  {hoveredMovieId === movie.id && (
                    <div className="absolute inset-0 bg-slate-900 opacity-50 z-10">
                      <button
                        className="m-4 p-4 rounded-xl border-pink-400 border hover:bg-purple-400 cursor-pointer"
                        onClick={() => toggleLiked(movie.id, movie)}
                      >
                        {likedMovies[movie.id] ? (
                          <GoHeartFill className="fill-red-600" />
                        ) : (
                          <GoHeart />
                        )}
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <div>No movies found</div>
            )}
          </ul>
        </div>
      ) : selectedLikedMovies.length > 0 ? (
        <div className="pt-20 px-10">
          <ul className="grid grid-cols-4 gap-8">
            {selectedLikedMovies.map((movie) => (
              <li key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.original_title}
                />
                <div className="flex flex-col">
                  <h4>{movie.original_title}</h4>
                  <h5>{movie.release_date}</h5>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Please like movies to see in this list</div>
      )}
    </div>
  );
};

export default MovieCard;
