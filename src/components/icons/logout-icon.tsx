const LogoutIcon = () => {
  return (
    <div className="transition-transform duration-200 ease-in-out hover:scale-110 group w-fit">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-[#212121] group-hover:stroke-red-600"
      >
        {/* Door shape */}
        <path
          d="M4 4H14C15.1046 4 16 4.89543 16 6V18C16 19.1046 15.1046 20 14 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"
          fill="#212121"
          className="group-hover:fill-red-600"
          strokeWidth="0.1"
        />

        {/* Arrow */}
        <path d="M20 12H10" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M16 8L20 12L16 16"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LogoutIcon;
