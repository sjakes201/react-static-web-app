import { useState, useEffect } from 'react'
import { useWebSocket } from "../WebSocketContext";


function PasswordReset() {
    const { waitForServerResponse } = useWebSocket();

    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');

    const [newPass, setNewPass] = useState('');
    const [newPassCon, setNewPassCon] = useState('');

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [log, setLog] = useState('')


    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let paramEmail = params.get('email');
        let paramCode = params.get('code')
        if (paramEmail !== null) setEmail(paramEmail);
        if (paramCode !== null) setCode(paramCode);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPass !== newPassCon) {
            setLog('Passwords do not match');
            return;
        }

        if (waitForServerResponse) { // Ensure `waitForServerResponse` is defined
            const response = await waitForServerResponse('resetPassword', {
                email: email,
                code: code,
                newPass: newPass
            });
            console.log(response);
        }

        setCode('')
        setEmail('')
        setNewPass('')
        setNewPassCon('')


    }

    return (
        <div style={{
            background: 'var(--menu_dark)',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                width: '40vw',
                height: '50vh',
                background: 'var(--menu_light)',
                boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid black'
                    }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}>
                        <label>
                            Email:
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                name='email'
                                type='email'
                                value={email}
                                required
                            ></input>
                        </label>
                        <label>
                            Reset Code:
                            <input
                                onChange={(e) => setCode(e.target.value)}
                                name='code'
                                type='text'
                                value={code}
                                required
                            ></input>
                        </label>
                        <hr style={{ width: '50%', border: '1px solid var(--menu_dark)' }} />
                        <label style={{ position: 'relative' }}>
                            New Password:
                            <input
                                onChange={(e) => setNewPass(e.target.value)}
                                name='pass'
                                type={showNew ? 'text' : 'password'}
                                value={newPass}
                                pattern="[A-Za-z0-9_.]{4,24}"
                                title="4 to 32 characters in length: letters, numbers, and special characters allowed"
                                required
                            ></input>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/reveal.png`}
                                style={{ width: '9%', objectFit: 'contain', position: 'absolute' }}
                                onMouseDown={() => setShowNew(true)}
                                onMouseUp={() => setShowNew(false)}
                                onMouseLeave={() => setShowNew(false)}
                            />
                        </label>
                        <label style={{ position: 'relative' }}>
                            Confirm Password:
                            <input
                                onChange={(e) => setNewPassCon(e.target.value)}
                                name='passconfirm'
                                type={showConfirm ? 'text' : 'password'}
                                value={newPassCon}
                                pattern="[A-Za-z0-9!@#$%^&*_\-\.]{4,32}"
                                title="4 to 24 characters in length: letters, numbers, _ and . allowed"
                                required
                            ></input>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/reveal.png`}
                                style={{ width: '9%', objectFit: 'contain', position: 'absolute' }}
                                onMouseDown={() => setShowConfirm(true)}
                                onMouseUp={() => setShowConfirm(false)}
                                onMouseLeave={() => setShowConfirm(false)}
                            />                        </label>
                    </div>
                    <p>{log}</p>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: '3%'
                    }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/goat_standing_right.png`} style={{ width: '9%', objectFit: 'contain' }} />
                        <input type="submit" value="Reset Password" />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ostrich_standing_right.png`} style={{ width: '9%', objectFit: 'contain' }} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PasswordReset