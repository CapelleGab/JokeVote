export type TypeButtonProps = {
  onClick: () => void;
  label: string;
  isActive: boolean;
};

export const TypeButton = (props: TypeButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`px-4 py-2 rounded max-sm:text-[10px] text-nowrap max-sm:py-1 ${
        props.isActive
          ? "bg-gray-700 text-white ease-in-out duration-150"
          : "bg-gray-500 text-white"
      } hover:bg-gray-600`}
    >
      {props.label}
    </button>
  );
};
