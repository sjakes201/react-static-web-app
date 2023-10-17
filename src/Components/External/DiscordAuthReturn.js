import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../WebSocketContext';
import React, { useEffect } from 'react'

function DiscordAuthReturn() {
    const { waitForServerResponse } = useWebSocket();
    const navigate = useNavigate();

    const checkDiscordAuthCode = async () => {
        let url = new URL(window.location.href);
        let code = url.searchParams.get("code");
        if (code) {
            console.log(code)
            // Send the code to your backend or handle as necessary
            let attempts = 0;
            const sendCode = async () => {
                if (waitForServerResponse) {
                    const response = await waitForServerResponse("linkDiscordAcc", {
                        code: code,
                    });
                    console.log(response)
                    localStorage.setItem("discordLinked", "true")
                    code = null;
                } else if (attempts < 10) {
                    attempts++;
                    setTimeout(() => {
                        sendCode();
                    }, 500);
                }
            };
            sendCode();
        } else {
            console.error("No code found in URL");
        }
    };

    const syncThenRedirect = async () => {
        await checkDiscordAuthCode();
        navigate(`/profile`)
    }

    useEffect(() => {
        syncThenRedirect();
    }, [])

    const dcEggStyle = {
        width: "1.4vw",
        margin: "1vw -.8vw 0 1.2vw"
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "beige",
            }}
        >
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                alt={"discord logo"}
                style={dcEggStyle}
                draggable={false}
            />
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                alt={"discord logo"}
                style={dcEggStyle}
                draggable={false}
            />
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/discord.png`}
                alt={"discord logo"}
                style={dcEggStyle}
                draggable={false}
            />
            <img
                src={`${process.env.PUBLIC_URL}/assets/images/chicken_collectible_walking_right.gif`}
                alt={"loading chicken"}
                style={{
                    width: "5vw",
                }}
                draggable={false}
            />
            <p></p>
        </div>
    )
}

export default DiscordAuthReturn