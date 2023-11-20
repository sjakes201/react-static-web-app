function SmallInfoTile({ children }) {

    return (
        <div
            className='hover-menu basic-center'
        >
            <div className='brown-border-thin more-info'>

                {children}
            </div>
        </div>
    )
}

export default SmallInfoTile