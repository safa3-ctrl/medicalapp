const Button = ({ type, children }) => {
  return (
    <button
      className="text-white bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900 hover:bg-gradient-to-br  font-bold rounded-lg text-[16px] px-4  text-center mr-2 mb-2  shadow  outline-none py-3"
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
