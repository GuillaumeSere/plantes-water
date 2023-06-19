import './App.css';
import CalendarPlant from './components/CalendarPlant';
import Footer from './components/Footer';
import Header from './components/Header';
import PlantList from './components/PlantList';

const App = () => {

    return (
        <>
            <Header />
            <PlantList />
            <CalendarPlant />
            <Footer />
        </>
    );
};

export default App;
