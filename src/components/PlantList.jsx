import React, { useEffect, useState } from 'react';

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

    return (
        <div className='container'>
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
                                <span>{plant.startDate ? plant.startDate.toLocaleDateString() : ''}</span>
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