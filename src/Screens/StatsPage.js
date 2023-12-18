import React, { useState } from 'react'
import "./CSS/StatsPage.css"


function StatsPage({ }) {

    const [currentPage, setCurrentPage] = useState("Main")

    const pages = ["Main", "Game stats", "Crops info", "Animals info", "Machines info"]

    const cropsPage = () => {
        return (<div>
            <p>This page contains information about all crops. Below you can find each crop's growth times and yields, for each upgrade level. You can also
                find out how boosts and fertilizers affect the growth time and yield of each crop.

            </p>
        </div>)
    }

    const getPage = () => {
        switch (currentPage) {
            case "Crops info":
                return cropsPage();
            default:
                return <div>Default</div>
        }
    }

    return (
        <div className='stats-page basic-center'>
            <div className='stats-center yellow-border'>
                <div className='stats-page-header'>
                    FarmGame.live
                </div>
                <div className='stats-nav-column'>
                    {pages.map((page, index) => {
                        return (
                            <button className={page === currentPage ? 'current-page' : ''} onClick={() => setCurrentPage(page)} key={index}>
                                {page}
                            </button>
                        )
                    })}
                </div>
                <div className='stats-content'>
                    {getPage()}
                </div>
            </div>
        </div>
    )
}

export default StatsPage;