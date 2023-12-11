import React, {useEffect, useState} from 'react';

import Grid from './Grid';
import Sprite from './Sprite';
import Environment from './Environment';
import WinState from './WinState';


function deepCloneArray(arr) {
    if (!Array.isArray(arr)) {
        // Not an array, return as is
        return arr;
    }

    return arr.map(element => {
        // Recursively clone each element if it's an array
        if (Array.isArray(element)) {
            return deepCloneArray(element);
        } else {
            // For non-array elements, return as is
            return element;
        }
    });
}

function deepEqualsIgnoreOrder(arr1, arr2) {
    if (arr1 === arr2) {
        return true;
    }


    if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
        return false;
    }

    // Function to sort an array of numbers
    const sortNumberArray = (a, b) => a - b;

    // Clone and sort the outer arrays and inner arrays
    let sortedArr1 = arr1.map(innerArr => [...innerArr].sort(sortNumberArray));
    let sortedArr2 = arr2.map(innerArr => [...innerArr].sort(sortNumberArray));

    // Sort the outer arrays based on their stringified versions for comparison
    sortedArr1.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    sortedArr2.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

    // Compare sorted arrays
    for (let i = 0; i < sortedArr1.length; i++) {
        if (JSON.stringify(sortedArr1[i]) !== JSON.stringify(sortedArr2[i])) {
            return false;
        }
    }

    return true;
}

// 0 indexed
const GRID_WIDTH = 15;
const GRID_HEIGHT = 23;


const LEVEL_1 = {
    envObjects: {
        grows: [[14, 4], [8, 15], [3, 22], [15, 20], [12, 16]],
        blocks: [ [1,6], [2,6], [3, 6], [6,6],[7,6], [8,6], [9,6], [10,6], [11,6], [13, 6], [10, 11], [13,23]],
    },
    sprite: {origin: [5, 1], points: [[5,1], [4,2], [3,3]], branches: {t: [], tl: [[4,2], [3,3]], tr: [], b: []}},
    winSprite: {origin: [8, 12], points: [[8,13], [8,12], [7, 13], [6, 14], [5,15], [4, 16], [9,13], [8,11], [8,10], [8,9]], branches: {t: [[8,13]], tl: [[7,13], [6,14], [5, 15], [4,16]], tr: [[9,13]], b: [[8,11], [8, 10], [8, 9]]}},
}

const LEVEL_2 = {
    envObjects: {
        grows: [[14, 22], [3,6], [3,7], [3,8], [3,9], [3,5], [3, 4], [1, 10], [12, 18],[9, 16], [10, 17], [13, 20], [10, 22], [7, 17]],
        blocks: [[14, 20], [12, 22], [13, 18], [11, 20], [11, 16], [9, 18], [7, 16], [5, 14], [10, 14], [11,14], [2,3], [1,3]],
    },
    sprite: {origin: [5, 1], points: [[5,1], [5, 0]], branches: {t: [], tl: [], tr: [], b: [[5, 0]]}},
    winSprite: {origin: [2, 2], points: [[2,2], [2,1], [2, 3], [1, 3], [0,4],[3,3], [4, 4], [5,5], [6,6], [7,7], [8,8], [9,9], [10,10], [11,11], [12,12], [13,13], [14,14], [2,0]], branches: {t: [[2,3]], tl: [[1,3], [0,4]], tr: [[3,3], [4, 4], [5,5], [6,6], [7,7], [8,8], [9,9], [10,10], [11,11], [12,12], [13,13], [14,14]], b: [[2,1], [2,0]]}},
}

const LEVEL_3 = {
    envObjects: {
        grows: [[15,6], [15,5], [15,4], [13,1], [2, 21], [5,22], [8, 15], [5,8]],
        blocks: [[1,23],[14, 3],[14,2], [14, 4], [14,6], [5, 19], [10,23], [9,16], [8, 13], [6,8], [6,7], [6, 9]],
    },
    sprite: {origin: [5, 1], points: [[5,1], [4,2], [3,3]], branches: {t: [], tl: [[4,2], [3,3]], tr: [], b: [], r:[]}},
    winSprite: {origin: [8, 12], points: [[8,13], [8,12], [8,11], [8,10], [8,9],[7, 13], [6, 14], [5, 15], [9,13], [10,14], [11,15], [9,12], [10,12]], branches: {t: [[8,13]], tl: [[7,13], [6,14], [5, 15]], tr: [[9,13], [10,14], [11,15]], b: [[8,11], [8,10], [8,9]], r: [[9,12], [10,12]]}},
}

const LEVEL_4 = {
    envObjects: {
        grows: [[14,3],[1,2],[7,9],[13, 4],[7, 8], [8,3],[2,15], [3,14], [4,13], [5,12], [8,11], [10,11],[9,9], [10,9], [10, 7], [11,6], [12,5], [8,5], [3,4], [8,2]],
        blocks: [[12,10],[12,8],[13,7],[14,6],[15,5],[0,1],[12,14], [13,13], [0,3],[2,1],[15,3],[14,2],[15,2],[13,23],[6,9],[7,4], [4,22],[13,22], [1,16],[0,16],[0,6],[1,7], [4,16],[5,15],[5,16],[1,17], [3,16],[12,21], [4, 23], [6,23], [8,13],[8,14],[8,15],[8,16],[8,17],[8,18],[8,19],[8,20], [8,21],[9,22],[10,23], [12,13], [11,9], [8,1], [9,4], [6,12], [4,12]],
    },
    sprite: {origin: [8, 7], points: [[8,7], [7,6], [6,5]], branches: {t: [], tl: [], tr: [], b: [], l: [], r: [], bl: [[7,6],[6,5]], br: []}},
    winSprite: {origin: [8, 9], points: [[8,9], [8,10], [8, 11], [8, 12], [9,10], [10, 11], [11,12],[7,10], [6,11], [5,12], [4,13], [3,14], [2,15], [9,9], [10,9], [9,8],[10,7],[11,6],[12,5],[13,4],[14,3],[8,8], [8,7], [8,6], [8,5], [8,4], [8,3],[8,2], [7,8], [6,7], [5,6], [4,5], [3,4], [2,3], [1,2], [7,9]], branches: {t: [[8,10], [8, 11], [8, 12]], tl: [[7,10], [6,11], [5,12], [4,13], [3,14], [2,15]], tr: [[9,10], [10, 11], [11,12]],r: [[9,9], [10,9]],br: [[9,8],[10,7],[11,6],[12,5],[13,4],[14,3]], b: [[8,8], [8,7], [8,6], [8,5], [8,4], [8,3],[8,2]], bl: [[7,8], [6,7], [5,6], [4,5], [3,4], [2,3], [1,2]], l: [[7,9]]}},
}

const levels = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4]

const grows = [
    [5,10],
    [9,14],
]

const blocks = [
    [10, 15],
]

const GameStructure = () => {
    const [hoverSprite, setHoverSprite] = useState(false)
    const [badDir, setBadDir] = useState("foo")
    const [lastDir, setLastDir] = useState("null")
    const [winState, setWinState] = useState("idle")
    const [addStack, setAddStack] = useState(false)
    const [level, setLevel] = useState(1);
    const [hoverSpriteData, setHoverSpriteData] = useState({origin: [0,0], points: [[0,0]], branches: {tl: [], t: [], tr: [], b: []}}) 
    const [winSprite, setWinSprite] = useState({...levels[level - 1].winSprite})
  const [sprite, setSprite] = useState({...levels[level - 1].sprite});
  const [gridStart, setGridStart] = useState({x: 0, y: 0})
  const [winGridStart, setWinGridStart] = useState({x: 0, y: 0})

  const [envObjects, setEnvObjects] = useState({...levels[level - 1].envObjects})
  const [stateStack, setStateStack] = useState([{lastDir: "null", sprite: {origin: [0,0], points: [[0,0]], branches: {tl: [], t: [], tr: [], b: []}}, envObjects: {grows: grows, blocks: blocks}}])


  useEffect(() => {
    setLastDir("null")
    setWinState("idle")
    setAddStack("false")
    setBadDir("foo")
    setWinSprite({...levels[level - 1].winSprite})
    setSprite({...levels[level - 1].sprite})
    setEnvObjects({...levels[level - 1].envObjects})
    setStateStack([{lastDir: "null", sprite: {origin: [0,0], points: [[0,0]], branches: {tl: [], t: [], tr: [], b: []}}, envObjects: {grows: grows, blocks: blocks}}])
  }, [level])

// Function to move the object
// const positionSprite = (newX, newY) => {
//   setPosition({ x: newX, y: newY });
// };

// Calculate position for CSS


// useEffect(() => {
//     console.log(stateStack.length, stateStack);
// }, [stateStack.length])
useEffect(() => {
    if (addStack) {
        setAddStack(false)
        setStateStack(prev => {
            let currSprite = JSON.parse(JSON.stringify(sprite));
            let currEnvObjects = JSON.parse(JSON.stringify(envObjects));

            prev.push({lastDir: lastDir, sprite: currSprite, envObjects: currEnvObjects});
            return prev;
        })
        
    }
}, [addStack])

// useEffect(() => {
//     console.log(envObjects.grows)
// }, [envObjects])
useEffect(() => {
    const winOrigin = winSprite.origin;
    const currOrigin = sprite.origin;
    let xTrans;
    let yTrans;
    if (winOrigin[0] >= currOrigin[0]) {
        xTrans = winOrigin[0] - currOrigin[0];
    } else {
        xTrans = -1 * (currOrigin[0] - winOrigin[0])
    }
    if (winOrigin[1] >= currOrigin[1]) {
        yTrans = winOrigin[1] - currOrigin[1];
    } else {
        yTrans = -1 * (currOrigin[1] - winOrigin[1])
    }
    let newSprite = JSON.parse(JSON.stringify(sprite));
    newSprite.points = newSprite.points.map(point => [point[0] + xTrans, point[1] + yTrans]);
    Object.keys(newSprite.branches).forEach(key => {
        newSprite.branches[key] = newSprite.branches[key].map(point => [point[0] + xTrans, point[1] + yTrans]);
    }) 
    newSprite.origin = winSprite.origin;
    setHoverSpriteData(prev => {
        return newSprite;
    })

}, [sprite])

useEffect(() => {
    const winPoints = translatePoints(winSprite.origin, winSprite.points);
    const currPoints = translatePoints(sprite.origin, sprite.points);
    if (deepEqualsIgnoreOrder(winPoints, currPoints)) {
        if (checkValidity(sprite.points)) {

            setWinState("win");
        }
    } else if (envObjects.grows.length === 0) {
        setWinState("lose");
    }
}, [envObjects.grows])

useEffect(() => {
    setEnvObjects(prevEnvObjects => {
        // Update envObjects and get the new value
        let currSprite = JSON.parse(JSON.stringify(sprite));
        const newGrows = checkGrowth(lastDir, currSprite, prevEnvObjects, "extraGrow");
        const newEnvObjects = { ...prevEnvObjects, grows: newGrows };
        
        if (newGrows.length > prevEnvObjects.grows.length) setAddStack(true);
        // Return the new state
        return newEnvObjects;
    });
}, [sprite.branches])

const translatePoints = (origin, points) => {
    let xadjust = origin[0];
    let yadjust = origin[1];
    let newPoints = []
    points.forEach(point => {
        newPoints.push([point[0] - xadjust, point[1] - yadjust])
    })
    return newPoints;
}

  useEffect(() => {
    const handleKeyDown = (e) => {
        let jawn = {
            'ArrowUp': "up",
            'ArrowDown': "down",
            'ArrowLeft': "left",
            'ArrowRight': 'right',
        }
        if (jawn[e.key] === badDir) return;
        switch(e.key) {
            case 'z':
                handleUndo();
                break;
            case 'ArrowUp':
                moveSprite("up");
                break;
            case 'ArrowDown':
                moveSprite("down");
    
                break;
            case 'ArrowLeft':
                moveSprite("left");
    
                break;
            case 'ArrowRight':
                moveSprite("right");
    
                break;
            default:
                break;
        }
      }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
  }, [badDir])


  const handleUndo = () => {
    if (stateStack.length > 1) {

        let newSprite = JSON.parse(JSON.stringify(stateStack[stateStack.length - 2].sprite));
        let newEnv = JSON.parse(JSON.stringify(stateStack[stateStack.length - 2].envObjects));
    
        setWinState("idle")
        setSprite(newSprite);
        setEnvObjects(newEnv);
        setLastDir(stateStack[stateStack.length - 2].lastDir)
        setStateStack(prev => {
                prev.pop();
            return prev;
        })
    }
  }

  const moveSprite = (dir) => {
    setSprite(prev => {
        // Create a deep copy of your previous state
        let newSprite = JSON.parse(JSON.stringify(prev));

        // Calculate the new position based on the direction
        switch(dir) {
            case 'up':
                newSprite.origin[1] += 1;
                newSprite.points = newSprite.points.map(point => [point[0], point[1] + 1]);
                Object.keys(newSprite.branches).forEach(key => {
                    newSprite.branches[key] = newSprite.branches[key].map(point => [point[0], point[1] + 1]);
                }) 

                break;
            case 'down':
                newSprite.origin[1] -= 1;
                newSprite.points = newSprite.points.map(point => [point[0], point[1] - 1]);
                Object.keys(newSprite.branches).forEach(key => {
                    newSprite.branches[key] = newSprite.branches[key].map(point => [point[0], point[1] - 1]);
                }) 

                break;
            case 'right':
                newSprite.origin[0] += 1;
                newSprite.points = newSprite.points.map(point => [point[0] + 1, point[1]]);
                Object.keys(newSprite.branches).forEach(key => {
                    newSprite.branches[key] = newSprite.branches[key].map(point => [point[0] + 1, point[1]]);
                }) 

                break;
            case 'left':
                newSprite.origin[0] -= 1;
                newSprite.points = newSprite.points.map(point => [point[0] - 1, point[1]]);
                Object.keys(newSprite.branches).forEach(key => {
                    newSprite.branches[key] = newSprite.branches[key].map(point => [point[0] - 1, point[1]]);
                }) 

                break;
            default:
                break;
        }

        // Check the validity of the new position
        if (checkValidity(newSprite.points)) {
            setEnvObjects(prevEnvObjects => {
                // Update envObjects and get the new value
                const newGrows = checkGrowth(dir, newSprite, prevEnvObjects, "null");
                const newEnvObjects = { ...prevEnvObjects, grows: newGrows };
                        
                // Return the new state
                return newEnvObjects;
            });
            setAddStack(true);
            setLastDir(dir);
            setBadDir("null");
            return newSprite;
        } else {
            // If not valid, return the previous state
            setBadDir(prev => dir);
            setLastDir(lastDir)
            return prev;
        }
    });
}

const checkGrowth = (dir, newSprite, currentEnvObjects, triggeredFrom) => {
    let growCount = 0;
    let removeThese = []
    let dirs = [];
    newSprite.points.forEach(point => {
        if (currentEnvObjects.grows.findIndex((index) => index[0] === point[0] && index[1] === point[1]) !== -1) {

            let newDir = dir
            if (triggeredFrom === "extraGrow") {

                if (newSprite.branches.tl && newSprite.branches.tl.length > 0) {
                    let tlCheck = newSprite.branches.tl[newSprite.branches.tl.length - 1];
                    if ((point[0]) === tlCheck[0] && (point[1]) === tlCheck[1]) {
                        newDir = "topLeft"
                    }
                }
                if (newSprite.branches.tr && newSprite.branches.tr.length > 0) {
    
                    let trCheck = newSprite.branches.tr[newSprite.branches.tr.length - 1];
                    if ((point[0]) === trCheck[0] && (point[1]) === trCheck[1]) {
                        newDir = "topRight"
                    }
                }
                if (newSprite.branches.bl && newSprite.branches.bl.length > 0) {
                    let blCheck = newSprite.branches.bl[newSprite.branches.bl.length - 1];
                    if ((point[0]) === blCheck[0] && (point[1]) === blCheck[1]) {
                        newDir = "bottomLeft"
                    }
                }
                if (newSprite.branches.br && newSprite.branches.br.length > 0) {
                    let brCheck = newSprite.branches.br[newSprite.branches.br.length - 1];
                    if ((point[0]) === brCheck[0] && (point[1]) === brCheck[1]) {
                        newDir = "bottomRight"
                    }
                }
                if (newSprite.branches.b && newSprite.branches.b.length > 0) {
                    let bCheck = newSprite.branches.b[newSprite.branches.b.length - 1];
                    if ((point[0]) === bCheck[0] && (point[1]) === bCheck[1]) {
                        newDir = "down"
                    }
                }
                if (newSprite.branches.t && newSprite.branches.t.length > 0) {
                    let uCheck = newSprite.branches.t[newSprite.branches.t.length - 1];
                    if ((point[0]) === uCheck[0] && (point[1]) === uCheck[1]) {
                        newDir = "up"
                    }
                }
                if (newSprite.branches.r && newSprite.branches.r.length > 0) {
                    let rCheck = newSprite.branches.r[newSprite.branches.r.length - 1];
                    if ((point[0]) === rCheck[0] && (point[1]) === rCheck[1]) {
                        newDir = "right"
                    }
                }
                if (newSprite.branches.l && newSprite.branches.l.length > 0) {
                    let lCheck = newSprite.branches.l[newSprite.branches.l.length - 1];
                    if ((point[0]) === lCheck[0] && (point[1]) === lCheck[1]) {
                        newDir = "left"
                    }
                }
            }
            dirs.push(newDir)
            removeThese.push(point)
            growCount++;
        } 
    })
    if (growCount > 0) {
        let growedSprite = JSON.parse(JSON.stringify(newSprite));

        for (let i =0; i < growCount; i++) {

            let newPoint;
            let validPoint
            switch(dirs[i]) {
                case 'up':
                    if (growedSprite.branches.tl) {
                        if (growedSprite.branches.tl.length === 0) {
                            newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1] + 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
                        } else {
                            newPoint = [growedSprite.branches.tl[growedSprite.branches.tl.length - 1][0] - 1, growedSprite.branches.tl[growedSprite.branches.tl.length - 1][1] + 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
                        }
                    }
                    if (growedSprite.branches.t) {
                        if (growedSprite.branches.t.length === 0) {
                            newPoint = [growedSprite.origin[0], growedSprite.origin[1] + 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.t.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.t[growedSprite.branches.t.length - 1][0], growedSprite.branches.t[growedSprite.branches.t.length - 1][1] + 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.t.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    if (growedSprite.branches.tr) {
                        if (growedSprite.branches.tr.length === 0) {
                            newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1] + 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tr.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.tr[growedSprite.branches.tr.length - 1][0] + 1, growedSprite.branches.tr[growedSprite.branches.tr.length - 1][1] + 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tr.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    break;
                case 'down':
                    if (growedSprite.branches.b) {
                        if (growedSprite.branches.b.length === 0) {
                            newPoint = [growedSprite.origin[0], growedSprite.origin[1] - 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.b.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.b[growedSprite.branches.b.length - 1][0], growedSprite.branches.b[growedSprite.branches.b.length - 1][1] - 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.b.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    if (growedSprite.branches.br) {
                        if (growedSprite.branches.br.length === 0) {
                            newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1] - 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.br.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.br[growedSprite.branches.br.length - 1][0] + 1, growedSprite.branches.br[growedSprite.branches.br.length - 1][1] - 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.br.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    if (growedSprite.branches.bl) {
                        if (growedSprite.branches.bl.length === 0) {
                            newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1] - 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.bl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.bl[growedSprite.branches.bl.length - 1][0] - 1, growedSprite.branches.bl[growedSprite.branches.bl.length - 1][1] - 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.bl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    break;
                case 'right':
                    if (growedSprite.branches.tr) {
                        if (growedSprite.branches.tr.length === 0) {
                            newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1] + 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tr.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.tr[growedSprite.branches.tr.length - 1][0] + 1, growedSprite.branches.tr[growedSprite.branches.tr.length - 1][1] + 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tr.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    if (growedSprite.branches.br) {
                        if (growedSprite.branches.br.length === 0) {
                            newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1] - 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.br.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.br[growedSprite.branches.br.length - 1][0] + 1, growedSprite.branches.br[growedSprite.branches.br.length - 1][1] - 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.br.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    if (growedSprite.branches.r) {
                        if (growedSprite.branches.r.length === 0) {
                            newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1]]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.r.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.r[growedSprite.branches.r.length - 1][0] + 1, growedSprite.branches.r[growedSprite.branches.r.length - 1][1]];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.r.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    break;
                case 'left':
                    if (growedSprite.branches.tl) {
                        if (growedSprite.branches.tl.length === 0) {
                            newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1] + 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.tl[growedSprite.branches.tl.length - 1][0] - 1, growedSprite.branches.tl[growedSprite.branches.tl.length - 1][1] + 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.tl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }

                    if (growedSprite.branches.l) {
                        if (growedSprite.branches.l.length === 0) {
                            newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1]]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.l.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.l[growedSprite.branches.l.length - 1][0] - 1, growedSprite.branches.l[growedSprite.branches.l.length - 1][1]];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.l.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }

                    if (growedSprite.branches.bl) {
                        if (growedSprite.branches.bl.length === 0) {
                            newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1] - 1]
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.bl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        } else {
                            newPoint = [growedSprite.branches.bl[growedSprite.branches.bl.length - 1][0] - 1, growedSprite.branches.bl[growedSprite.branches.bl.length - 1][1] - 1];
                            validPoint = checkIndividualPoint(newPoint);
                            if (validPoint) {
                                growedSprite.branches.bl.push(newPoint)
                                growedSprite.points.push(newPoint)
                            }
        
                        }
                    }
                    break;

                    case 'topLeft':
                        if (growedSprite.branches.tl) {
                            if (growedSprite.branches.tl.length === 0) {
                                newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1] + 1]
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.tl.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
                            } else {
                                newPoint = [growedSprite.branches.tl[growedSprite.branches.tl.length - 1][0] - 1, growedSprite.branches.tl[growedSprite.branches.tl.length - 1][1] + 1];
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.tl.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
                            }
                        }
                        if (growedSprite.branches.t) {
                            if (growedSprite.branches.t.length === 0) {
                                newPoint = [growedSprite.origin[0], growedSprite.origin[1] + 1]
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.t.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            } else {
                                newPoint = [growedSprite.branches.t[growedSprite.branches.t.length - 1][0], growedSprite.branches.t[growedSprite.branches.t.length - 1][1] + 1];
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.t.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            }
                        }

                        if (growedSprite.branches.l) {
                            if (growedSprite.branches.l.length === 0) {
                                newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1]]
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.l.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            } else {
                                newPoint = [growedSprite.branches.l[growedSprite.branches.l.length - 1][0] - 1, growedSprite.branches.l[growedSprite.branches.l.length - 1][1]];
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.l.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            }
                        }
                        break;

                        case 'bottomLeft':

                        if (growedSprite.branches.bl) {
                            if (growedSprite.branches.bl.length === 0) {
                                newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1] - 1]
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.bl.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            } else {
                                newPoint = [growedSprite.branches.bl[growedSprite.branches.bl.length - 1][0] - 1, growedSprite.branches.bl[growedSprite.branches.bl.length - 1][1] - 1];
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.bl.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            }
                        }
                        if (growedSprite.branches.l) {
                            if (growedSprite.branches.l.length === 0) {
                                newPoint = [growedSprite.origin[0] - 1, growedSprite.origin[1]]
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.l.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            } else {
                                newPoint = [growedSprite.branches.l[growedSprite.branches.l.length - 1][0] - 1, growedSprite.branches.l[growedSprite.branches.l.length - 1][1]];
                                validPoint = checkIndividualPoint(newPoint);
                                if (validPoint) {
                                    growedSprite.branches.l.push(newPoint)
                                    growedSprite.points.push(newPoint)
                                }
            
                            }
                        }
                            if (growedSprite.branches.b) {
                                if (growedSprite.branches.b.length === 0) {
                                    newPoint = [growedSprite.origin[0], growedSprite.origin[1] - 1]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.b.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                } else {
                                    newPoint = [growedSprite.branches.b[growedSprite.branches.b.length - 1][0], growedSprite.branches.b[growedSprite.branches.b.length - 1][1] - 1];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.b.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                }
                            }

                            break;

                        case 'bottomRight':
                            if (growedSprite.branches.r) {
                                if (growedSprite.branches.r.length === 0) {
                                    newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1]]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.r.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                } else {
                                    newPoint = [growedSprite.branches.r[growedSprite.branches.r.length - 1][0] + 1, growedSprite.branches.r[growedSprite.branches.r.length - 1][1]];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.r.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                }
                            }

                            if (growedSprite.branches.br) {
                                if (growedSprite.branches.br.length === 0) {
                                    newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1] - 1]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.br.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                } else {
                                    newPoint = [growedSprite.branches.br[growedSprite.branches.br.length - 1][0] + 1, growedSprite.branches.br[growedSprite.branches.br.length - 1][1] - 1];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.br.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                }
                            }

                            if (growedSprite.branches.b) {
                                if (growedSprite.branches.b.length === 0) {
                                    newPoint = [growedSprite.origin[0], growedSprite.origin[1] - 1]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.b.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                } else {
                                    newPoint = [growedSprite.branches.b[growedSprite.branches.b.length - 1][0], growedSprite.branches.b[growedSprite.branches.b.length - 1][1] - 1];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.b.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                }
                            }
                            break;

                        case 'topRight':
                            if (growedSprite.branches.tr) {
                                if (growedSprite.branches.tr.length === 0) {
                                    newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1] + 1]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.tr.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                                } else {
                                    newPoint = [growedSprite.branches.tr[growedSprite.branches.tr.length - 1][0] + 1, growedSprite.branches.tr[growedSprite.branches.tr.length - 1][1] + 1];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.tr.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                                }
                            }
                            if (growedSprite.branches.t) {
                                if (growedSprite.branches.t.length === 0) {
                                    newPoint = [growedSprite.origin[0], growedSprite.origin[1] + 1]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.t.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                } else {
                                    newPoint = [growedSprite.branches.t[growedSprite.branches.t.length - 1][0], growedSprite.branches.t[growedSprite.branches.t.length - 1][1] + 1];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.t.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                }
                            }
                            if (growedSprite.branches.r) {
                                if (growedSprite.branches.r.length === 0) {
                                    newPoint = [growedSprite.origin[0] + 1, growedSprite.origin[1]]
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.r.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                } else {
                                    newPoint = [growedSprite.branches.r[growedSprite.branches.r.length - 1][0] + 1, growedSprite.branches.r[growedSprite.branches.r.length - 1][1]];
                                    validPoint = checkIndividualPoint(newPoint);
                                    if (validPoint) {
                                        growedSprite.branches.r.push(newPoint)
                                        growedSprite.points.push(newPoint)
                                    }
                
                                }
                            }
                            break;
                default:
                    break;
            }
        }
        setSprite(prev => growedSprite);

    }
    if (removeThese.length > 0) {
            const copy = JSON.parse(JSON.stringify(currentEnvObjects));
            copy.grows = copy.grows.filter(item => {
                return (removeThese.findIndex((index) => index[0] === item[0] && index[1] === item[1]) === -1)
            })
            return copy.grows;
    } else {
        return currentEnvObjects.grows;
    }
}

  const checkValidity = (newPoints) => {
    let valid = true;
    newPoints.forEach(point => {
        if (point[0] < 0 || point[0] > GRID_WIDTH) {
            valid = false;
        }
        if (point[1] < 0 || point[1] > GRID_HEIGHT) {
            valid = false;
        }
        if (envObjects.blocks.findIndex((index) => index[0] === point[0] && index[1] === point[1]) !== -1){
            valid = false;
        } 
    })
    return valid;
  }

  const checkIndividualPoint = (point) => {
    let valid = true;
    if (point[0] < 0 || point[0] > GRID_WIDTH) {
        setWinState("lose");
    }
    if (point[1] < 0 || point[1] > GRID_HEIGHT) {
        setWinState("lose");
    }
    if (envObjects.blocks.findIndex((index) => index[0] === point[0] && index[1] === point[1]) !== -1){
        valid = false;
    } 
    return valid;
  }

  const handleSetLevel = (newLevel) => {
    setLevel(newLevel)
  }

  return (
    <div className='game'>
        
        <div style={{display: winState !== "idle" ? "block" : "none"}} className='win-text'>
            {winState === "win" ? <h1 style={{color: "green"}}>YOU WIN</h1> : <h1 style={{color: "red"}}>YOU LOSE</h1>}
        </div>
        <Environment envObjects={envObjects} gridStart={gridStart}/>
        <Sprite spriteData={sprite} gridStart={gridStart}/>
        {hoverSprite && <Sprite spriteData={hoverSpriteData} gridStart={winGridStart} /> }
        <Sprite spriteData={winSprite} gridStart={winGridStart} hoverSprite={hoverSprite}/>

        <div style={{display: "flex", flexDirection: "column"}}>

            <Grid setGridStart={setGridStart}/>
            <div style={{display: "flex", flexDirection: "row"}}>
                <button onClick={() => handleSetLevel(1)}>level 1</button>
                <button onClick={() => handleSetLevel(2)}>level 2</button>
                <button onClick={() => handleSetLevel(3)}>level 3</button>
                <button onClick={() => handleSetLevel(4)}>level 4</button>

            </div>
        </div>
        <div>
            win state (not coordinate dependant)
            <WinState setWinGridStart={setWinGridStart} setHoverSprite={setHoverSprite}/>
        </div>
    </div>
  )
}

export default GameStructure