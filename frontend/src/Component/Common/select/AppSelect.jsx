import Select from "react-select";

const selectClassNames = {
  control: () =>
    "min-h-10 w-full rounded-md border border-gray-300 bg-gray-50 text-sm font-medium shadow-none hover:border-gray-300 dark:border-gray-500 dark:bg-gray-600",
  valueContainer: () => "px-2",
  placeholder: () => "text-gray-500",
  singleValue: () => "text-gray-900 dark:text-white",
  input: () => "text-gray-900 dark:text-white custom-reactSelect",
  indicatorSeparator: () => "hidden",
  menu: () =>
    "z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700",
  option: ({ isFocused, isSelected }) =>
    `cursor-pointer px-5 py-2 text-sm ${
      isSelected
        ? "bg-gray-900 text-white"
        : isFocused
          ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white"
          : "bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
    }`,
};

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const AppSelect = ({ className = "w-[170px]", ...props }) => {
  return (
    <div className={className}>
      <Select
        isClearable
        unstyled
        classNames={selectClassNames}
        styles={selectStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        {...props}
      />
    </div>
  );
};

export default AppSelect;