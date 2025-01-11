"use client";

import { useEffect, useState } from "react";
import getJoke from "./api/jokeAPI";
import { Joke } from "./components/joke";
import { TypeButton } from "./components/TypeButton";

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

  const handleAddFavorite = (label: string, answer: string) => {
    const existingFavoriteIndex = Favorites.findIndex(
      (fav) => fav.label === label && fav.answer === answer
    );

    if (existingFavoriteIndex !== -1) {
      // Si la blague est déjà dans les favoris, on la retire
      const updatedFavorites = Favorites.filter(
        (fav) => fav.label !== label || fav.answer !== answer
      );
      setFavorites(updatedFavorites);
      if (label === joke && answer === answer) {
        setIsFav(false);
      }
    } else {
      // Sinon, on l'ajoute
      const newFavorite = {
        id: Date.now(),
        label: joke,
        answer: answer,
      };
      setFavorites([...Favorites, newFavorite]);
      setIsFav(true);
      handleClick();
    }
  };

  useEffect(() => {
    const storedJokes = localStorage.getItem("Favorites");
    if (storedJokes) {
      setFavorites(JSON.parse(storedJokes));
    }
  }, []);

  useEffect(() => {
    const existingFavoriteIndex = Favorites.findIndex(
      (fav) => fav.label === joke && fav.answer === answer
    );
    setIsFav(existingFavoriteIndex !== -1);
  }, [joke, answer, Favorites]);

  useEffect(() => {
    localStorage.setItem("Favorites", JSON.stringify(Favorites));
  }, [Favorites]);

  return (
    <main className="h-screen flex flex-col gap-10 items-center justify-center">
      <div className="p-10 flex justify-center flex-col items-center h-fit max-h-[1000px] w-[70%] ring-1 ring-gray-400 shadow-xl bg-white rounded-lg">
        <h1 className="text-black text-2xl font-bold mb-4">
          Générateur de blagues
        </h1>
        <div className="w-full mb-8 flex justify-end gap-2">
          <TypeButton
            onClick={() => handleChangeType("dark")}
            label="Humour noir"
            isActive={type === "dark"}
          />
          <TypeButton
            onClick={() => handleChangeType("beauf")}
            label="Beauf"
            isActive={type === "beauf"}
          />
          <TypeButton
            onClick={() => handleChangeType("limit")}
            label="Limite"
            isActive={type === "limit"}
          />
          <TypeButton
            onClick={() => handleChangeType("dev")}
            label="Développeur"
            isActive={type === "dev"}
          />
          <TypeButton
            onClick={() => handleChangeType("random")}
            label="Aléatoire"
            isActive={type === "random"}
          />
        </div>
        <hr />
        <div className="gap-2 w-full mb-4">
          {joke !== "" ? (
            <Joke
              text={joke}
              answer={answer}
              isFav={isFav}
              onClick={() => handleAddFavorite(joke, answer)}
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

        <div className="w-full">
          <h3 className="text-left text-2xl mb-3">Mes Favories</h3>
          <div className="flex flex-col w-full gap-3 overflow-y-scroll scrollbar-custom p-1 max-h-72">
            {Favorites.slice()
              .reverse()
              .map((fav) => (
                <span key={fav.id}>
                  <Joke
                    text={fav.label}
                    answer={fav.answer}
                    onClick={() => handleAddFavorite(fav.label, fav.answer)}
                    isFav={true}
                  />
                </span>
              ))}
          </div>
        </div>
      </div>

      <footer>
        &copy; 2025 Copyright JokeGenerator made by Gabin Capelle with ❤️
      </footer>
    </main>
  );
}
