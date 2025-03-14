import React from "react";

const NavBar = () => {
  const handleFindBoard = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("openFindBoardModal"));
  };

  return (
    <nav className="bg-[#b9a68c] p-4 w-full border-b border-[#8b6d48] shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-[#3b2f25] text-xl font-bold">BingoScape</div>
        <div className="flex space-x-4">
          <a
            href="#find"
            onClick={handleFindBoard}
            className="text-[#3b2f25] font-semibold transition transform hover:text-[#111] hover:scale-105"
          >
            Find your board
          </a>
          <a
            href="#create"
            className="text-[#3b2f25] font-semibold transition transform hover:text-[##111] hover:scale-105"
          >
            Create a new board
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
