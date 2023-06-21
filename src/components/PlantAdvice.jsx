import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlantAdvice = () => {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://house-plants2.p.rapidapi.com/all-lite',
                    headers: {
                        'X-RapidAPI-Key': '73bd6cd858msh86fca75a76a05b0p1d8af6jsn22a208bbfee6',
                        'X-RapidAPI-Host': 'house-plants2.p.rapidapi.com'
                    }
                };

                const response = await axios.request(options);
                setPlants(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching plants:', error);
            }
        };

        fetchPlants();
    }, []);

    return (
        <div className='container-plante'>
            {plants.length > 0 ? (
                <div className='card-plante'>
                       <h2 className='title-plante'>Info Plantes</h2>
                    {plants.map((plant) => (
                        <div key={plant.id} className='plante'>
                            <div className='title-category'><span>Categorie: </span>{plant.Categories}</div>
                            <img src={plant.Img} alt={plant['Common name (fr.)']} />
                            <div className='plante-description'><span>Nom de la plante: </span>{plant['Common name (fr.)']}</div>
                            <div className='plante-description'><span>Climat: </span>{plant.Climat}</div>
                            <div className='plante-description'><span>Famille: </span> {plant.Family}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading plants...</p>
            )}
        </div>
    );
};

export default PlantAdvice;
