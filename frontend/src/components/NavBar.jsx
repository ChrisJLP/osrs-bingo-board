import React from "react";

const NavBar = () => {
  const handleFindBoard = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("openFindBoardModal"));
  };

  return (
    <nav className="bg-[#362511] p-4 shadow-md w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-[#FDF6E3] text-xl font-bold">BingoScape</div>
        <div className="flex space-x-4">
          <a
            href="#find"
            onClick={handleFindBoard}
            className="text-[#FDF6E3] transition transform hover:text-[#D4AF37] hover:scale-105"
          >
            Find your board
          </a>
          <a
            href="#create"
            className="text-[#FDF6E3] transition transform hover:text-[#D4AF37] hover:scale-105"
          >
            Create a new board
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
