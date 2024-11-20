import React, { useState, useEffect, useCallback } from 'react';
import { Chart } from 'chart.js/auto';
import socket from './socket';

const categorieAutorise = ['flop', 'racisme', 'nerd', 'nbSessionVanne', 'cervo', 'caca'];

function Camembert() {
    const [classement, setClassement] = useState([]);
    const [selectCategorie, setSelectCategorie] = useState('flop');

    useEffect(() => {
        const fetchData = async () => {
            socket.emit('getCamembert', selectCategorie);
            console.log(selectCategorie);
            const responseClassement = await new Promise(resolve => {
                socket.on('seeCamembert', data => {
                    resolve(data);
                });
            });

            setClassement(responseClassement);
        };

        fetchData();
    }, [selectCategorie]);


    const drawChart = useCallback(() => {
        var oilCanvas = document.getElementById("oilChart");

        if (!Chart.defaults.global) {
            Chart.defaults.global = {};
        }

        const labels = classement.map(entry => entry.prenom);
        const data = classement.map(entry => entry[selectCategorie]);

        const Data = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        "noir",
                        "blue",
                        "red",
                        "purple",
                        "green",
                        "pink",
                        "brown",
                        "yellow",
                        "gray",
                        "white",
                        "magenta"
                    ]
                }
            ]
        };

        var existingChart = oilCanvas.chart;
        if (existingChart) {
            existingChart.destroy();
        }

        var pieChart = new Chart(oilCanvas, {
            type: 'pie',
            data: Data
        });

        oilCanvas.chart = pieChart;
    }, [classement,selectCategorie]);

    useEffect(() => {
        drawChart();
    }, [drawChart]);

    return (
        <div className = 'centerBox'>
            <select value={selectCategorie} onChange={(e) => setSelectCategorie(e.target.value)} id='selectCategorie' required>
                {categorieAutorise.map((categorie, index) => (
                <option key={index} value={categorie}>
                    {categorie}
                </option>
                ))}
            </select>
            <canvas id="oilChart" width="600" height="400"></canvas>
        </div>
    );
}

export default Camembert;