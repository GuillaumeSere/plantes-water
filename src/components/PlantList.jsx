import React, { useEffect, useState } from 'react';
import { sendWateringReminder } from '../services/emailService';

const PlantList = () => {

    const [plants, setPlants] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newPlant, setNewPlant] = useState({
        name: '',
        species: '',
        waterAmount: '',
        waterFrequency: '',
        startDate: new Date()
    });
    const [editingPlantIndex, setEditingPlantIndex] = useState(null);
    const [editedPlant, setEditedPlant] = useState({
        name: '',
        species: '',
        waterAmount: '',
        waterFrequency: '',
        startDate: new Date()
    });
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
    const [isEmailValid, setIsEmailValid] = useState(false);

    const loadPlantsFromLocalStorage = () => {
        const savedPlants = localStorage.getItem('plants');
        if (savedPlants) {
            const parsedPlants = JSON.parse(savedPlants);
            const loadedPlants = parsedPlants.map((plant) => ({
                ...plant,
                startDate: new Date(plant.startDate)
            }));
            return loadedPlants;
        }
        return [];
    };

    useEffect(() => {
        const loadedPlants = loadPlantsFromLocalStorage();
        setPlants(loadedPlants);
    }, []);

    const savePlantsToLocalStorage = (plants) => {
        const plantsToSave = plants.map((plant) => ({
            ...plant,
            startDate: plant.startDate.toISOString()
        }));
        localStorage.setItem('plants', JSON.stringify(plantsToSave));
    };

    const handleInputChange = (e, field) => {
        const value = field === 'startDate' ? new Date(e.target.value) : e.target.value;

        if (editingPlantIndex === null) {
            setNewPlant((prevPlant) => ({
                ...prevPlant,
                [field]: value
            }));
        } else {
            setEditedPlant((prevPlant) => ({
                ...prevPlant,
                [field]: value
            }));
        }
    };

    const handleAddPlant = (e) => {
        e.preventDefault();

        const reader = new FileReader();
        reader.onload = () => {
            const imageBase64 = reader.result;
            const newPlantWithImage = {
                ...newPlant,
                image: imageBase64,
                startDate: new Date(newPlant.startDate),
                wateringDates: generateWateringDates(newPlant.startDate, newPlant.waterFrequency)
            };

            const updatedPlants = [...plants, newPlantWithImage];
            setPlants(updatedPlants);
            savePlantsToLocalStorage(updatedPlants);

            setNewPlant({
                name: '',
                species: '',
                waterAmount: '',
                waterFrequency: '',
                startDate: new Date()
            });

            setSelectedImage(null);
        };

        if (selectedImage) {
            reader.readAsDataURL(selectedImage);
        }
    };

    const generateWateringDates = (startDate, frequency) => {
        const wateringDates = [];
        let currentDate = new Date(startDate);

        while (wateringDates.length < 30) {
            wateringDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + parseInt(frequency));
        }

        return wateringDates;
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleEditPlant = (index) => {
        const plantToEdit = plants[index];
        setEditingPlantIndex(index);
        setEditedPlant({
            name: plantToEdit.name,
            species: plantToEdit.species,
            waterAmount: plantToEdit.waterAmount,
            waterFrequency: plantToEdit.waterFrequency,
            startDate: plantToEdit.startDate
        });
    };

    const handleSaveChanges = (e, index) => {
        e.preventDefault();

        const updatedPlants = [...plants];
        updatedPlants[index] = { ...updatedPlants[index], ...editedPlant };

        setPlants(updatedPlants);
        savePlantsToLocalStorage(updatedPlants);

        // Réinitialisez les états d'édition
        setEditingPlantIndex(null);
        setEditedPlant({
            name: '',
            species: '',
            waterAmount: '',
            waterFrequency: '',
            startDate: ''
        });
    };

    const handleDeletePlant = (index) => {
        const updatedPlants = [...plants];
        updatedPlants.splice(index, 1);
        setPlants(updatedPlants);
        savePlantsToLocalStorage(updatedPlants);
    };

    // Ajout de la fonction de vérification des plantes à arroser
    const checkPlantsToWater = () => {
        const today = new Date();
        const plantsToWater = plants.filter(plant => {
            const wateringDate = new Date(plant.startDate);
            return wateringDate.toDateString() === today.toDateString();
        });

        if (plantsToWater.length > 0 && userEmail) {
            plantsToWater.forEach(plant => {
                sendWateringReminder(plant, userEmail);
            });
        }
    };

    // Vérification quotidienne des plantes à arroser
    useEffect(() => {
        const checkInterval = setInterval(checkPlantsToWater, 24 * 60 * 60 * 1000); // Vérifie toutes les 24 heures
        return () => clearInterval(checkInterval);
    }, [plants, userEmail]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
            localStorage.setItem('userEmail', userEmail);
            setIsEmailValid(true);
            // Vérifier immédiatement les plantes à arroser
            checkPlantsToWater();
        }
    };

    // Fonction pour mettre à jour la date d'arrosage d'une plante
    const handleWateredToday = (index) => {
        const updatedPlants = [...plants];
        const today = new Date();
        updatedPlants[index].startDate = today;
        // Recalcule les prochaines dates d'arrosage
        if (updatedPlants[index].waterFrequency) {
            updatedPlants[index].wateringDates = generateWateringDates(today, updatedPlants[index].waterFrequency);
        }
        setPlants(updatedPlants);
        savePlantsToLocalStorage(updatedPlants);
    };

    return (
        <div className='container'>
            <h1>Entrez votre mail pour les notifications</h1>
            <div className='email-settings'>
                <form onSubmit={handleEmailSubmit} className="email-form">
                    <input
                        type="email"
                        placeholder="Votre email pour les notifications"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="email-input"
                        required
                    />
                    <button 
                        type="submit" 
                        className="btn-validate"
                        disabled={!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)}
                    >
                        Valider
                    </button>
                    {isEmailValid && (
                    <p className="email-success">Email validé avec succès ! Vous recevrez des notifications pour l'arrosage de vos plantes.</p>
                )}
                </form>
            </div>
            <h2>Mes Plantes</h2>
            <div className='container-card'>
                {plants.map((plant, index) => (
                    <div key={index}>
                        {editingPlantIndex === index ? (
                            <form onSubmit={(e) => handleSaveChanges(e, index)}>
                                <input
                                    type="text"
                                    value={editedPlant.name}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                />
                                <input
                                    type="text"
                                    value={editedPlant.species}
                                    onChange={(e) => handleInputChange(e, 'species')}
                                />
                                <input
                                    type="text"
                                    value={editedPlant.waterAmount}
                                    onChange={(e) => handleInputChange(e, 'waterAmount')}
                                />
                                <input
                                    type="text"
                                    value={editedPlant.waterFrequency}
                                    onChange={(e) => handleInputChange(e, 'waterFrequency')}
                                />
                                <button type="submit">Enregistrer les modifications</button>
                            </form>
                        ) : (
                            <div className='card'>
                                <div> <strong>{plant.name} : </strong><span>{plant.species}</span></div>
                                <div><strong>Quantitée d'eau : </strong><span>{plant.waterAmount}</span></div>
                                <div> <strong>Fréquence d'arrosage :</strong><span>{plant.waterFrequency}</span></div>
                                {plant.image && <img src={plant.image} alt={plant.name} />}
                                <strong>Date d'arrosage :</strong>
                                <span>{plant.startDate ? new Date(plant.startDate).toLocaleDateString() : ''}</span>
                                <button onClick={() => handleWateredToday(index)} style={{marginRight: '8px'}}>Arrosée aujourd'hui</button>
                                <button onClick={() => handleEditPlant(index)}>Modifier</button>
                                <button className='btn-delete' onClick={() => handleDeletePlant(index)}>Supprimer</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <h3>Ajouter Plante</h3>
            <form onSubmit={handleAddPlant}>
                <input
                    type="text"
                    name="name"
                    placeholder="Plante"
                    value={newPlant.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                />
                <input
                    type="text"
                    name="species"
                    placeholder="Espèce"
                    value={newPlant.species}
                    onChange={(e) => handleInputChange(e, 'species')}
                />
                <input
                    type="text"
                    name="waterAmount"
                    placeholder="Quantitée d'eau"
                    value={newPlant.waterAmount}
                    onChange={(e) => handleInputChange(e, 'waterAmount')}
                />
                <input
                    type="text"
                    name="waterFrequency"
                    placeholder="Fréquence d'arrosage"
                    value={newPlant.waterFrequency}
                    onChange={(e) => handleInputChange(e, 'waterFrequency')}
                />
                <input
                    type="date"
                    name="startDate"
                    value={newPlant.startDate.toISOString().substr(0, 10)}
                    onChange={(e) => handleInputChange(e, 'startDate')}
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">Ajouter Plante</button>
            </form>
        </div>
    );
};

export default PlantList;