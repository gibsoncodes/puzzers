import React from 'react'
const CELL_WIDTH = 25;

const GrowOrb = ({position, gridStart}) => {

    const XTOGRID = gridStart.x;
    const YTOGRID = gridStart.y
    const orbStyle = {
        left: `${XTOGRID + (position[0] * CELL_WIDTH)}px`,
        top: `${YTOGRID + (position[1] * CELL_WIDTH * -1)}px`, 
      };    
  return (
    <div className='grow-orb' style={orbStyle}>
    </div>
  )
}

export default GrowOrb