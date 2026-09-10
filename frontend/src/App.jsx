import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <main className="page">
      <h1>Hyperlocal Skills Exchange</h1>
      <p>Trade skills, not money.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
