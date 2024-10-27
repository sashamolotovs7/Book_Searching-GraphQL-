import { Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchBooks />} />
        <Route path="/saved" element={<SavedBooks />} />
      </Routes>
    </>
  );
};

export default App;
