import axios from "axios";

interface JokesProps {
  filtre?: string;
}

const getJoke = async ({ filtre }: JokesProps) => {
  const baseAPI = "https://api.blagues-api.fr/api/";
  const tokenAPI = process.env.NEXT_PUBLIC_TOKENAPI;

  try {
    const response = await axios.get(
      `${baseAPI}${
        filtre !== "random" ? "type/" + filtre + "/random" : "random"
      }`,
      {
        headers: {
          Authorization: `Bearer ${tokenAPI}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la blague:", error);
    throw new Error(
      "Une erreur est survenue lors de la récupération de la blague."
    );
  }
};

export default getJoke;
