import React, { useEffect } from 'react'

const Grid = ({setGridStart}) => {

    useEffect(() => {
        let xel = document.querySelector("#grid-start-x");
        let yel = document.querySelector("#grid-start-y");
        setGridStart({x: xel.offsetLeft - 1, y: yel.offsetTop})
    }, [])

    const gridItems = [];
    for (let i = 0; i < (24 * 16); i++) {
        if (i === 0) {
            gridItems.push(<div id="grid-start-x" className='grid-item'></div>)
        } else if (i === 380) {
            gridItems.push(<div id="grid-start-y" className='grid-item'></div>)
        } else {
            gridItems.push(<div className='grid-item'></div>)
        }
    }


  return (
    <div className='grid-outer'>
        {gridItems}
    </div>
  )
}

export default Grid