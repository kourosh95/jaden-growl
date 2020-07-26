import React from 'react'

import './growl.css'

export const Growl = ({ active, message, onDismissed, hoverMessage}) => {
    
    const [state, setState] = React.useState(true) 
    const [hoverRef, isHovered] = useHover();
    const [mainTimerID, setID] = React.useState(0)
    const [remaining, setRemain] = React.useState(0)
    const [start, setStart] = React.useState(0)


    //pause the timer while mouse is on the component
    const pause = () =>{
        clearTimeout(mainTimerID)
        setRemain(Date.now() - start)
    }

    //resume the timer once the mouse moves off the component
    const resume = () =>{
        clearTimeout(mainTimerID)
        setStart(Date.now())
        setID(setTimeout(()=>{handleCross()}, remaining))
    }
    
    
    const handleCross = () => {
        setState(false)
        onDismissed()
    }
    //starts a timer at the end of which handleClick is called
    const startTimer = (seconds = 3) => {
        return setTimeout(()=>{handleCross()}, seconds*1000)
    }

    React.useEffect(() => {
        setStart(Date.now())
        setState(true)
        //save the reference to the memory to clear when rendering again
        setID(startTimer(5))
        //clear the timer
        return () => {
            //clearTimeout(mainTimerID)
            pause()
        }
    }, [active])

    

    return (
        <div ref={hoverRef} onMouseEnter={pause} onMouseLeave={resume} className={`growl${active && state ? ' active' : ''}`}>
            {isHovered ? hoverMessage : message}
            <div onClick={handleCross} className="growl-close"></div>
        </div>
    )
}

export function useGrowl() {
    // state of the growl
    const [growlActive, setGrowlActive] = React.useState(false)
    

    return [
        // the first arg is the state
        growlActive,

        // the second arg is a fn that allows you to safely set its state
        (active) => {
            setGrowlActive(active)
        },
    ]
}

//An event listener for when the mouse is over the component
export function useHover() {
    const [value, setValue] = React.useState(false);
  
    const ref = React.useRef(null);
  
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);
  
    React.useEffect(
      () => {
        const node = ref.current;
        if (node) {
          node.addEventListener('mouseover', handleMouseOver);
          node.addEventListener('mouseout', handleMouseOut);
  
          return () => {
            node.removeEventListener('mouseover', handleMouseOver);
            node.removeEventListener('mouseout', handleMouseOut);
          };
        }
      },
      [ref.current] 
    );
  
    return [ref, value];
  }
