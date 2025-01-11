import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export type Props = {
  text: string;
  answer: string;
  isFav: boolean;
  onClick: () => void;
};

export const Joke = (props: Props) => {
  return (
    <div className="p-4 ring-2 ring-neutral-500 rounded-lg">
      <div className="float-end">
        {props.isFav ? (
          <MdFavorite color="black" width={20} />
        ) : (
          <MdFavoriteBorder color="black" width={20} onClick={props.onClick} />
        )}
      </div>
      <p className="text-base text-black mb-3 mr-24">{props.text}</p>
      <p className="text-base text-black blur-md hover:blur-0 ease-in-out duration-200">
        {props.answer}
      </p>
    </div>
  );
};
