export const Search = ({
  searchQuery,
  handleSearchChange,
  handleCurrencyChange,
  dataApp,
  inputRef,
}) => {
  return (
    <div className="flex items-center w-full gap-2">
      {/* Поиск — растягиваем на всю доступную ширину */}
      <div className="flex-1">
        <label className="input input-bordered rounded-sm flex items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="grow"
            placeholder="Поиск ..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      {/* Выбор валюты — справа, фиксированная ширина */}
      <div>
        <label className="form-control w-auto">
          <select
            className="select select-bordered rounded-sm min-w-[80px]"
            value={dataApp.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          >
            <option value="BYN">BYN</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </div>
    </div>
  );
};
