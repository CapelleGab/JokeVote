import axios from "axios";

interface JokesProps {
  filtre?: string;
}

const getJoke = async ({ filtre }: JokesProps) => {
  const baseAPI = "https://api.blagues-api.fr/api/";
  const tokenAPI =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMzA1MDI4MDQ0MDQ3Nzc3NzkyIiwibGltaXQiOjEwMCwia2V5IjoiNG42ZjN6S29WUE5XTkZVMzkxMWdPcHVGcllpTEQzbWE3MHVDeEJkcEVodUFSWWZBUnoiLCJjcmVhdGVkX2F0IjoiMjAyNS0wMS0wOVQxMTo1MTo1MSswMDowMCIsImlhdCI6MTczNjQyMzUxMX0.4gYQr7ZBgYbSVcLQvwWS68oa0jbOmHtwjt4u3Vte6RU";

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
