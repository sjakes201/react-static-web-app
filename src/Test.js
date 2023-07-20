import React, { useState } from "react";


function Test() {

    const plant = async (seed, tile) => {
        //seed = name from item locater, tile = int [1,24]
        const response = await fetch('/UserRoutes/tiles/plant', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                seedName: seed,
                tileID: tile
            })
        })
    }

    const harvest = async (tile) => {
        // tile is int [1,24]
        const response = await fetch('/UserRoutes/tiles/harvest', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                tileID: tile
            })
        })
    }

    const buy = async (cropName, num) => {
        const response = await fetch('/UserRoutes/shop/buy', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                item: cropName,
                count: num
            })
        })
    }

    const marketSell = async (cropName, num) => {
        const response = await fetch('/UserRoutes/shop/market_sell', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                item: cropName,
                count: num
            })
        })
    }

    const [plantInfo, setPlantInfo] = useState({
        cropName: "",
        tileID: -1,
    });
    const [harvestInfo, setHarvestInfo] = useState({
        tileID: -1
    });
    const [buyInfo, setBuyInfo] = useState({
        cropName: "",
        num: 0
    })
    const [marketInfo, setMarketInfo] = useState({
        cropName: "",
        num: 0
    })

    


    const [animal, setAnimal] = useState("");
    const [animalCollect, setAnimalCollect] = useState(-1);

    const collectSubmit = async(e) => {
        e.preventDefault();
        const response = fetch('/UserRoutes/animal/collect', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                AnimalID: animalCollect
            })
        })
    }


    const animalSubmit = async(e) => {
        e.preventDefault();
        const response = fetch('/UserRoutes/shop/buyAnimal', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                type: animal
            })
        })
    }


    const testCALL = async(e) => {
        e.preventDefault();
        const response = await fetch('/UserRoutes/profile/leaderboard', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(x=>x.json());
        console.log(response);
    }

    const harvestSubmit = async (e) => {
        e.preventDefault();
        let res = await harvest(harvestInfo.tileID);
    }
    const plantSubmit = async (e) => {
        e.preventDefault();
        let res = await plant(plantInfo.cropName, plantInfo.tileID);
    }
    const buySubmit = async (e) => {
        e.preventDefault();
        let res = await buy(buyInfo.cropName, buyInfo.num);
    }
    const marketSubmit = async (e) => {
        e.preventDefault();
        let res = await marketSell(marketInfo.cropName, marketInfo.num);
    }



    
    return (
        <div>
            <label>Harvest tile<input name="tileID" type="number" value={harvestInfo.tileID} onChange={(e) => {
                setHarvestInfo({ ...harvestInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <button onClick={harvestSubmit}>Harvest</button>
            <br />
            <br />
            <label>Plant tile<input name="tileID" type="number" value={plantInfo.tileID} onChange={(e) => {
                setPlantInfo({ ...plantInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <label>Plant seed name<input name="cropName" type="text" value={plantInfo.cropName} onChange={(e) => {
                setPlantInfo({ ...plantInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <button onClick={plantSubmit}>Plant</button>
            <br />
            <br />
            <label>Buy seeds type<input name="cropName" type="text" value={buyInfo.cropName} onChange={(e) => {
                setBuyInfo({ ...buyInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <label>Buy seeds num<input name="num" type="number" value={buyInfo.num} onChange={(e) => {
                setBuyInfo({ ...buyInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <button onClick={buySubmit}>Buy</button>
            <br />
            <br />
            <label>Market crop<input name="cropName" type="text" value={marketInfo.cropName} onChange={(e) => {
                setMarketInfo({ ...marketInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <label>Market num<input name="num" type="number" value={marketInfo.num} onChange={(e) => {
                setMarketInfo({ ...marketInfo, [e.target.name]: e.target.value });
            }}></input></label>
            <button onClick={marketSubmit}>Market Sell</button>

            <br/><br/>
            <label>Animal type<input name="type" type="text" value={animal} onChange={(e) => {
                setAnimal(e.target.value);
            }}></input></label>
            <button onClick={animalSubmit}>Animal buy</button>

            

            <br/><br/>
            <label>Animal collect ID<input name="type" type="text" value={animalCollect} onChange={(e) => {
                setAnimalCollect(e.target.value);
            }}></input></label>
            <button onClick={collectSubmit}>Collect</button>

            
            <button onClick={testCALL}>TEST CALL</button>

        </div>
    )

}


export default Test;