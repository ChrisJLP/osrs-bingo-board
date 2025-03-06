import BingoBoard from "./features/board/components/BingoBoard";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="p-5">
      <NavBar />
      <BingoBoard />
    </div>
  );
}

export default App;
