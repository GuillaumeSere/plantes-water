import './App.css';
import CalendarPlant from './components/CalendarPlant';
import Description from './components/Description';
import Footer from './components/Footer';
import Header from './components/Header';
import PlantAdvice from './components/PlantAdvice';
import PlantList from './components/PlantList';

const App = () => {

    return (
        <>
            <Header />
            <div className='content'>
                <Description />
                <PlantList />
                <CalendarPlant />
                <PlantAdvice />
            </div>
            <Footer />
        </>
    );
};

export default App;
