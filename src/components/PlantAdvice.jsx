import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FaArrowLeft} from 'react-icons/fa';
import {FaArrowRight} from 'react-icons/fa';

const PlantAdvice = () => {
    const [plants, setPlants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 16;

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
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
                setPlants(response.data);
            } catch (error) {
                console.error('Error fetching plants:', error);
            }
        };

        fetchPlants();
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPlants = plants.slice(startIndex, endIndex);


    return (
        <div className='container-plante'>
            {plants.length > 0 ? (
                <div className='card-plante'>
                    <h2 className='title-plante'>Info Plantes</h2>
                    <div className='btn'>
                        <button className='btn-left' onClick={handlePrevPage} disabled={currentPage === 1}><FaArrowLeft/></button>
                        <button className='btn-right' onClick={handleNextPage} disabled={currentPage === totalPages}><FaArrowRight/></button>
                    </div>
                    {currentPlants.map((plant) => (
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
