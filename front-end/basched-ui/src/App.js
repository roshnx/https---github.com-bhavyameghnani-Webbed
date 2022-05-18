import './App.css';
import Home from './components/LandingPage/Home';
import Dashboard from './components/Dashboard';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
    // <div className="App">
    //   <Home/>
    // </div>
  );
}

export default App;
