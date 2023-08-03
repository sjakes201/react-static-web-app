import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InitLoading({ }) {

    /*
    To finish loading need both init imgs loaded and at least 800ms to pass
    For psych, to give non init images time to load, and to not flash screen fast and confuse them
    */

    const [initImgsLoaded, setInitLoad] = useState(false);
    const [loadTimePassed, setTimePassed] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [log, setLog] = useState("")
    const navigate = useNavigate();

    // Images on the plant screen or that could be used immediately
    const FIRST_IMAGES = ["dirt.png", "homie.png", "oats_seeds.png", "corn_seeds.png", "corn_stage_0.png", "oats_stage_0.png", "corn.png", "oats.png", "chicken_standing_right.png"];
    // Secondary images in menus, all icons, and all stage 0's
    const ICONS = ["success.gif", "fail.gif", "seeds.png", "scythe.gif", "market-down.png",
        "market-up.png", "market-neutral.png"]
    const STAGE0s = ["bamboo_stage_0.png", "beet_stage_0.png",
        "blueberry_stage_0.png", "cauliflower_stage_0.png", "grape_stage_0.png", "hops_stage_0.png",
        "melon_stage_0.png", "parsnip_stage_0.png", "potato_stage_0.png", "pumpkin_stage_0.png",
        "strawberry_stage_0.png", "yam_stage_0.png"]
    const SEEDS = ["blueberry_seeds.png", "bamboo_seeds.png", "beet_seeds.png", "cauliflower_seeds.png", "grape_seeds.png",
        "hops_seeds.png", "melon_seeds.png", "parsnip_seeds.png", "potato_seeds.png", "pumpkin_seeds.png", "strawberry_seeds.png",
        "yam_seeds.png"];
    const PRODUCE = ["chicken_egg.png", "cauliflower.png", "beet.png", "bamboo.png", "blueberry.png", "duck_egg.png", "grape.png", "hops.png",
        "goat_milk.png", "kiwi_egg.png", "llama_wool.png", "ostrich_egg.png", "parsnip.png", "potato.png", "pumpkin.png", "quail_egg.png",
        "strawberry.png", "sheep_wool.png", "yak_milk.png", "yam.png",];
    const ANIMALS = ["quail_standing_right.png", "ostrich_standing_right.png", "kiwi_standing_right.png", "goat_standing_right.png",
        "yak_standing_right.png", "duck_standing_right.png", "cow_standing_right.png"]


    // async is innate in image loading, async function type is just to remind
    const preloadInitialImages = async (paths) => {
        let toLoad = paths.length;
        paths.forEach((path) => {
            const img = new Image();
            img.onload = () => {
                toLoad--;
                if (toLoad <= 0) {
                    setInitLoad(true);
                }
            }
            img.src = `${process.env.PUBLIC_URL}/assets/images/${path}`;
        });
    };

    const preloadSecondaryImages = async (paths) => {
        let toLoad = paths.length;
        paths.forEach((path) => {
            const img = new Image();
            img.onload = () => {
                toLoad--;
                if (toLoad <= 0) {
                    setInitLoad(true);
                }
            }
            img.src = `${process.env.PUBLIC_URL}/assets/images/${path}`;
        });
    }

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (token === null) {
            const tempLogin = await fetch('https://farm-api.azurewebsites.net/api/tempAuth', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: {}
            })
            if (tempLogin.ok) {
                const data = await tempLogin.json();
                if (data.auth) {
                    localStorage.setItem('token', data.token);
                    setAuthorized(true)
                } else {
                    setLog("Loading failed :( try clearing cookies and reloading")
                }
            } else {
                setLog("Loading failed :( try clearing cookies and reloading")
            }
        } else {
            setAuthorized(true)
        }
    }

    const finishLoading = () => {
        navigate('/plants');
    }

    setTimeout(() => {
        setTimePassed(true);
    }, 800)

    useEffect(() => {
        checkAuth();
        preloadInitialImages(FIRST_IMAGES);
        preloadSecondaryImages(ICONS);
        preloadSecondaryImages(SEEDS);
        preloadSecondaryImages(PRODUCE);
        preloadSecondaryImages(STAGE0s);
        preloadSecondaryImages(ANIMALS);

        sessionStorage.setItem("equipped", "");


    }, [])

    useEffect(() => {
        if (loadTimePassed && initImgsLoaded && authorized) {
            finishLoading();
        }
    }, [loadTimePassed, initImgsLoaded, authorized])





    return (<div
        style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'beige'
        }}>
        <img
            src={`${process.env.PUBLIC_URL}/assets/images/chicken_collectible_walking_right.gif`}
            alt={'loading chicken'}
            style={{
                width: '5vw'
            }}
            draggable={false} />
            <p>{log}</p>
    </div>)

}

export default InitLoading;