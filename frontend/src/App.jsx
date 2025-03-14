import BingoBoard from "./features/board/components/BingoBoard";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="bg-[#e4d9c8] min-h-screen w-full">
      <NavBar />
      <div className="max-w-5xl mx-auto p-4">
        <BingoBoard />
      </div>
    </div>
  );
}

export default App;
