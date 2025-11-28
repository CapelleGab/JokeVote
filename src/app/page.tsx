"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";
import getJoke from "./api/jokeAPI";
import { Joke } from "./components/joke";
import { TypeButton } from "./components/TypeButton";
import { cn } from "@/lib/utils";

const JOKE_TYPES = [
  { id: "dark", label: "Humour noir" },
  { id: "beauf", label: "Beauf" },
  { id: "limit", label: "Limite" },
  { id: "dev", label: "Développeur" },
  { id: "random", label: "Aléatoire" },
];

export default function Home() {
  const [joke, setJoke] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [type, setType] = useState<string>("random");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [Favorites, setFavorites] = useState<
    { id: number; label: string; answer: string }[]
  >([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setIsFav(false);
    try {
      const fetchedJoke = await getJoke({ filtre: type });
      setJoke(fetchedJoke.joke);
      setAnswer(fetchedJoke.answer);
    } catch (error) {
      console.error("Erreur lors de la récupération de la blague:", error);
      setJoke("Une erreur est survenue.");
      setAnswer("La réponse n'a pas été renseignée.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeType = (changedType: string) => {
    setType(changedType);
    setIsDropdownOpen(false);
  };

  const handleAddFavorite = (label: string, answer: string) => {
    const existingFavoriteIndex = Favorites.findIndex(
      (fav) => fav.label === label && fav.answer === answer
    );

    if (existingFavoriteIndex !== -1) {
      const updatedFavorites = Favorites.filter(
        (fav) => fav.label !== label || fav.answer !== answer
      );
      setFavorites(updatedFavorites);
      if (label === joke && answer === answer) {
        setIsFav(false);
      }
    } else {
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
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-slate-50 overflow-hidden -z-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl glass-panel rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-6 md:p-12">
          <header className="text-center mb-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent mb-2"
              initial={{ letterSpacing: "-0.1em", opacity: 0 }}
              animate={{ letterSpacing: "-0.05em", opacity: 1 }}
              transition={{ duration: 1 }}
            >
              JokeVote.
            </motion.h1>
            <p className="text-slate-500 font-medium">
              Générateur de blagues premium
            </p>
          </header>

          {/* Categories - Desktop (Tabs) */}
          <div className="hidden md:flex justify-center mb-12">
            <div className="bg-slate-200/50 p-1.5 md:p-2 rounded-full flex flex-wrap justify-center gap-1.5 md:gap-3 backdrop-blur-sm">
              <LayoutGroup>
                {JOKE_TYPES.map((t) => (
                  <TypeButton
                    key={t.id}
                    onClick={() => handleChangeType(t.id)}
                    label={t.label}
                    isActive={type === t.id}
                  />
                ))}
              </LayoutGroup>
            </div>
          </div>

          {/* Categories - Mobile (Custom Dropdown) */}
          <div className="md:hidden mb-8 relative z-50 px-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white/80 backdrop-blur-md border border-white/60 py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-sm text-slate-700 font-semibold transition-all active:scale-[0.99]"
            >
              <span className="truncate">
                {JOKE_TYPES.find((t) => t.id === type)?.label || "Choisir une catégorie"}
              </span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <MdKeyboardArrowDown className="w-6 h-6 text-slate-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 mx-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-1.5 flex flex-col gap-0.5">
                    {JOKE_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleChangeType(t.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                          type === t.id
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {t.label}
                        {type === t.id && (
                          <MdCheck className="w-5 h-5 text-violet-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Joke Display Area */}
          <div className="min-h-[200px] flex items-center justify-center mb-12">
            <AnimatePresence mode="wait">
              {joke ? (
                <motion.div
                  key={joke + answer} // Unique key for animation
                  className="w-full"
                >
                  <Joke
                    text={joke}
                    answer={answer}
                    isFav={isFav}
                    onClick={() => handleAddFavorite(joke, answer)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="text-6xl">🎭</div>
                  <p className="text-slate-400 font-medium">
                    Prêt à rire ? Choisissez une catégorie.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center mb-16">
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className={cn(
                "relative px-8 py-3 md:px-10 md:py-4 bg-slate-900 text-white text-base md:text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70",
                loading && "cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex items-center gap-2",
                  loading && "opacity-0"
                )}
              >
                Générer une blague <span className="text-yellow-400">✨</span>
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </motion.button>
          </div>

          {/* Favorites Section */}
          <AnimatePresence>
            {Favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-200 pt-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-slate-200 flex-1" />
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Vos Favoris
                  </h3>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                  <AnimatePresence initial={false}>
                    {Favorites.slice()
                      .reverse()
                      .map((fav) => (
                        <motion.div
                          key={fav.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{
                            opacity: 0,
                            scale: 0.9,
                            transition: { duration: 0.2 },
                          }}
                          layout
                        >
                          <Joke
                            text={fav.label}
                            answer={fav.answer}
                            onClick={() =>
                              handleAddFavorite(fav.label, fav.answer)
                            }
                            isFav={true}
                          />
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <footer className="mt-8 text-slate-400 text-sm font-medium text-center relative z-10">
        &copy; 2025 JokeVote • Made with ❤️ by Gabin Capelle
      </footer>
    </main>
  );
}
