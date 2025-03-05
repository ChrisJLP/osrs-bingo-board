import React from "react";

const NavBar = () => {
  const handleFindBoard = (e) => {
    e.preventDefault();
    // Dispatch a custom event so that BingoBoard can open the "find board" modal.
    window.dispatchEvent(new CustomEvent("openFindBoardModal"));
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">BingoScape</div>
        <div className="flex space-x-4">
          <a
            href="#find"
            onClick={handleFindBoard}
            className="text-white hover:text-gray-300"
          >
            Find your board
          </a>
          <a href="#create" className="text-white hover:text-gray-300">
            Create a new board
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
