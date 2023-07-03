interface SelectCategory {
  buttons: string[];
  value: number;
  setValue: (value: number) => void;
}

const SelectCategory = (props: SelectCategory) => {
  const { buttons, value, setValue } = props;

  const changePostForm = (value: number) => {
    setValue(value);
  };

  return (
    <div>
      <div className="mt-4 mb-2 text-base">카테고리</div>
      <div className="flex gap-2">
        {buttons.map((label, idx) => {
          return (
            <button
              key={label}
              className={
                value === idx + 1
                  ? "px-4 py-0.5 rounded-xl border-2 border-main-400 bg-main-400 text-sm text-white hover:border-main-400 focus:outline-none"
                  : "px-4 py-0.5 rounded-xl border-2 border-inherit bg-white text-sm text-black hover:border-inherit focus:outline-none"
              }
              onClick={(e) => {
                e.preventDefault();
                changePostForm(idx + 1);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectCategory;
