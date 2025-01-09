"use client";

import { useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import getJoke from "./api/jokeAPI";

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
    const newFavorite = {
      id: Date.now(),
      label: joke,
      answer: answer,
    };
    setIsFav(true);
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
    <main className="h-screen flex items-center justify-center">
      <div className="p-10 flex justify-center flex-col items-center h-fit w-[70%] bg-white rounded-lg">
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
        <hr />
        <div className="gap-2 flex flex-col">
          {joke !== "" ? (
            <div className="p-4 ring-2 ring-neutral-500 rounded-lg">
              <div className="float-end">
                {isFav ? (
                  <MdFavorite color="black" width={20} />
                ) : (
                  <MdFavoriteBorder
                    color="black"
                    width={20}
                    onClick={handleAddFavorite}
                  />
                )}
              </div>
              <p className="text-base text-black mb-2 mr-24">{joke}</p>
              <p className="text-base text-black blur-md hover:blur-0 ease-in-out duration-200">
                {answer}
              </p>
            </div>
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
      </div>
    </main>
  );
}
