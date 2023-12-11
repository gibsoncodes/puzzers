import React, { useEffect } from 'react'


const CELL_WIDTH = 25;
const DIAGONAL_STEP = 35.5;
const VERTICAL_STEP = 26;
const Sprite = ({spriteData, gridStart, hoverSprite}) => {

    useEffect(() => {
    }, [spriteData])
    const XTOGRID = gridStart.x;
    const YTOGRID = gridStart.y
    const spriteStyle = {
        left: `${XTOGRID + (spriteData.origin[0] * CELL_WIDTH)}px`,
        top: `${YTOGRID + (spriteData.origin[1] * CELL_WIDTH * -1)}px`, 
        "opacity": hoverSprite ? .3 : 1,
      };    

      const topStyle = {
        height: `${12 + (VERTICAL_STEP * (spriteData.branches.t ? spriteData.branches.t.length : 0))}px`
      }
      const bottomStyle = {
        height: `${12 + (VERTICAL_STEP * (spriteData.branches.b ? spriteData.branches.b.length : 0))}px`
      }
      const tlStyle = {
        height: `${16 + (DIAGONAL_STEP * (spriteData.branches.tl ? spriteData.branches.tl.length : 0))}px`
      }
      const trStyle = {
        height: `${16 + (DIAGONAL_STEP * (spriteData.branches.tr ? spriteData.branches.tr.length : 0))}px`
      }
      const blStyle = {
        height: `${16 + (DIAGONAL_STEP * (spriteData.branches.bl ? spriteData.branches.bl.length : 0))}px`
      }
      const brStyle = {
        height: `${16 + (DIAGONAL_STEP * (spriteData.branches.br ? spriteData.branches.br.length : 0))}px`
      }
      const leftStyle = {
        height: `${12 + (VERTICAL_STEP * (spriteData.branches.l ? spriteData.branches.l.length : 0))}px`
      }
      const rightStyle = {
        height: `${12 + (VERTICAL_STEP * (spriteData.branches.r ? spriteData.branches.r.length : 0))}px`
      }
  return (
    <div className='sprite-container' style={spriteStyle} >
        <div className='sprite-body'>

            {spriteData.branches.t && <div className='sprite sprite-top' style={topStyle}></div>}
            {spriteData.branches.tr && <div className='sprite sprite-top-right' style={trStyle}></div>}
            {spriteData.branches.r && <div className='sprite sprite-right' style={rightStyle}></div>}
            {spriteData.branches.br && <div className='sprite sprite-bottom-right' style={brStyle}></div>}
            {spriteData.branches.b && <div className='sprite sprite-bottom' style={bottomStyle}></div>}
            {spriteData.branches.bl && <div className='sprite sprite-bottom-left' style={blStyle}></div>}
            {spriteData.branches.l && <div className='sprite sprite-left' style={leftStyle}></div>}
            {spriteData.branches.tl && <div className='sprite sprite-top-left' style={tlStyle}></div>}
        </div>
    </div>
  )
}

export default Sprite