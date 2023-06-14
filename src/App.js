import './App.css';
import CalendarPlant from './components/CalendarPlant';
import Footer from './components/Footer';
import Header from './components/Header';
import PlantList from './components/PlantList';

const App = () => {

    return (
        <div>
            <Header />
            <PlantList />
            <CalendarPlant />
            <Footer />
        </div>
    );
};

export default App;
