"use client";

import { useEffect, useState } from "react";
import getJoke from "./api/jokeAPI";
import { Joke } from "./components/joke";

export default function Home() {
  const [joke, setJoke] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [type, setType] = useState<string>("random");
  const [Favorites, setFavorites] = useState<
    { id: number; label: string; answer: string }[]
  >([]);
  const [isFav, setIsFav] = useState(false);

  const handleClick = async () => {
    setIsFav(false);
    try {
      const fetchedJoke = await getJoke({ filtre: type });
      setJoke(fetchedJoke.joke);
      setAnswer(fetchedJoke.answer);
    } catch (error) {
      console.error("Erreur lors de la récupération de la blague:", error);
      setJoke("Une erreur est survenue.");
      setAnswer("La réponse n'a pas été renseignée.");
    }
  };

  const handleChangeType = (changedType: string) => {
    setType(changedType);
  };

  const handleAddFavorite = () => {
    if (isFav) {
      setIsFav(false);
      return;
    }
    const newFavorite = {
      id: Date.now(),
      label: joke,
      answer: answer,
    };
    setIsFav(!isFav);
    setFavorites([...Favorites, newFavorite]);
  };

  useEffect(() => {
    const storedJokes = localStorage.getItem("Favorites");
    if (storedJokes) {
      setFavorites(JSON.parse(storedJokes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Favorites", JSON.stringify(Favorites));
  }, [Favorites]);

  return (
    <main className="h-screen flex flex-col gap-10 items-center justify-center">
      <div className="p-10 flex justify-center flex-col items-center h-fit w-[70%] ring-1 ring-gray-400 shadow-xl bg-white rounded-lg">
        <h1 className="text-black text-2xl font-bold mb-4">
          Générateur de blagues
        </h1>
        <div className="w-full mb-4 flex justify-end gap-2">
          <button
            onClick={() => handleChangeType("dark")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Humour noir
          </button>
          <button
            onClick={() => handleChangeType("beauf")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Beauf
          </button>
          <button
            onClick={() => handleChangeType("limit")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Limite
          </button>
          <button
            onClick={() => handleChangeType("dev")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Développeur
          </button>
          <button
            onClick={() => handleChangeType("global")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Globale
          </button>
          <button
            onClick={() => handleChangeType("random")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Random
          </button>
        </div>

        <div className="gap-2">
          {joke !== "" ? (
            <Joke
              text={joke}
              answer={answer}
              isFav={isFav}
              onClick={handleAddFavorite}
            />
          ) : (
            <></>
          )}
        </div>
        <button
          onClick={handleClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Générer une blague
        </button>

        <br />

        <div className="flex flex-col w-full">
          <h3 className="text-left text-2xl mb-3">My Favorite</h3>
          <div className="flex flex-col gap-3">
            {Favorites.map((fav) => (
              <span key={fav.id}>
                <Joke
                  text={fav.label}
                  answer={fav.answer}
                  onClick={handleAddFavorite}
                  isFav={isFav}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer>&copy; 2025, by Gabin made with ❤️</footer>
    </main>
  );
}
