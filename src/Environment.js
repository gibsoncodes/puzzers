import React from 'react'

import GrowOrb from './GrowOrb';
import Blocker from './Blocker';

const Environment = ({envObjects, gridStart}) => {
  return (
    <div className='environment'>
        {envObjects.grows.map(position => {
            return <GrowOrb position={position} gridStart={gridStart} />
        })}
        {envObjects.blocks.map(position => {
            return <Blocker position={position} gridStart={gridStart} />
        })}
    </div>
  )
}

export default Environment