export type Props = {
  text: string;
  answer: string;
};

export const Joke = (props: Props) => {
  return (
    <div className="p-4 ring-2 ring-neutral-500 rounded-lg">
      <p className="text-base text-black">{props.text}</p>
      <p className="text-base text-black">{props.answer}</p>
    </div>
  );
};
