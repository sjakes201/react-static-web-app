import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react'

function AnimalsTopBar({ setManager }) {
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//api.adinplay.com/libs/aiptag/pub/FRM/farmgame.live/tag.min.js";
        script.async = true;

        script.onload = () => {
            if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
                window.aiptag.cmd.display.push(function () {
                    if (typeof window.aipDisplayTag === 'function') {
                        window.aipDisplayTag.display('farmgame-live_728x90');
                    }
                });
            }
        };

        document.body.appendChild(script);

        // Add ad refresh here, within the same useEffect
        if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
            window.aiptag.cmd.display.push(function () {
                if (typeof window.aipDisplayTag.display === 'function') {
                    window.aipDisplayTag.display('farmgame-live_728x90');
                }
            });
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    return (
        <div style={{
            width: '80vw',
            height: '90px',
            background: 'var(--menu_light)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            borderBottom: '1px solid black',
            position: 'relative'
        }}>
            <div style={{
                width: '100%',
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png)`,
                backgroundRepeat: 'repeat, repeat',
                height: '100%',
            }}>
                {window.innerWidth >= 1022 &&
                    <div style={{ position: 'relative', width: '728px', height: '90px', zIndex: '20000', border: '1px solid black' }}>
                        <div id="farmgame-live_728x90"></div>
                    </div>
                }
            </div>
            <div style={{
                maxWidth: '9%',
                maxHeight: '100%',
                objectFit: 'contain',
                boxSizing: 'border-box',
                boxShadow: '0 0 0 1px var(--black), 0 0 0 3px var(--border_orange), 0 0 0 5px var(--border_shadow_orange), 0 0 0 7px var(--black)',
                zIndex: '3',
                background: 'var(--menu_light)',
                position: 'absolute',
                bottom: '9px',
                right: '2%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end'
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/animal_manage.png`}
                    style={{
                        width: '100%',
                        maxHeight: '100%',
                        cursor: 'pointer',
                        objectFit: 'contain',
                    }}
                    onClick={() => setManager(true)}
                />

            </div>
        </div>
    )

}

export default AnimalsTopBar;