import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import TimerPage from './components/time-tracking/MonthTracker';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/timer" element={<TimerPage />} />
                <Route path="/entries" element={<TimerPage />} /> {/* Or create separate EntryPage */}
            </Routes>
        </Router>
    );
}

export default App
