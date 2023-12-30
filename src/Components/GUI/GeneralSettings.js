import React, { useContext } from 'react'
import { GameContext } from '../../GameContainer';
import "./GeneralSettings.css"

function GeneralSettings({ close }) {
    const { generalConfig, setGeneralConfig } = useContext(GameContext);
    console.log(generalConfig)

    const flipSettings = (name) => {
        setGeneralConfig((old) => {
            let newConfig = { ...old };
            newConfig[name] = !newConfig[name];
            return newConfig;
        })
    }

    return (
        <div
            className='fog-focus-light basic-center'
            onClick={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) {
                    close()
                }
            }}
        >
            <div className='general-settings-container yellow-border'>
                <p className='general-settings-x' onClick={close}>X</p>
                <u className='general-settings-header'>General settings</u>
                <label
                    className='general-settings-row'
                    onClick={() => flipSettings("stackInventory")}

                >
                    <input
                        className='settings-checkbox'
                        type="checkbox"
                        name="stack-inventory"
                        checked={generalConfig.stackInventory}
                    />
                    Stack inventory items in 1000's
                </label>
                <label
                    className='general-settings-row'
                    onClick={() => flipSettings("disableAnimations")}>
                    <input
                        className='settings-checkbox'
                        type="checkbox"
                        name="disable-animations"
                        checked={!generalConfig.disableAnimations}
                    />
                    Enable season animations (falling leaves)
                </label>

            </div>
        </div>
    )
}

export default GeneralSettings;