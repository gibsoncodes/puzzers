import React, {useEffect} from 'react'

const WinState = ({winSprite, setWinGridStart, setHoverSprite}) => {


    const handleMouseEnter = () => {
        if (setHoverSprite) {
            setHoverSprite(true)
        }
    }

    const handleMouseLeave = () => {
        if (setHoverSprite) {
            setHoverSprite(false)
        }
    }
    useEffect(() => {
        let xel = document.querySelector("#wgrid-start-x");
        let yel = document.querySelector("#wgrid-start-y");
        setWinGridStart({x: xel.offsetLeft - 1, y: yel.offsetTop})
    }, [])

    const gridItems = [];
    for (let i = 0; i < (24 * 16); i++) {
        if (i === 0) {
            gridItems.push(<div id="wgrid-start-x" className='grid-item-w'></div>)
        } else if (i === 380) {
            gridItems.push(<div id="wgrid-start-y" className='grid-item-w'></div>)
        } else {
            gridItems.push(<div className='grid-item-w'></div>)
        }
    }


  return (
    <div className='grid-outer' style={{border: "none"}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {gridItems}
    </div>
  )
}

export default WinState