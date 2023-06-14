import './App.css';
import CalendarPlant from './components/CalendarPlant';
import Header from './components/Header';
import PlantList from './components/PlantList';

const App = () => {

    return (
        <div>
            <Header />
            <PlantList />
            <CalendarPlant />
        </div>
    );
};

export default App;
