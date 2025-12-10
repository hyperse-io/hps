import { useRef, useState } from "react";
import scrollIntoView from 'scroll-into-view-if-needed';

export default function Widget() {
  const [targetData,setTargetData]=useState<{
    name:string
  } | undefined>()
  const ref=useRef<any>(null)


  const clickHandler=()=>{
    setTargetData({name:'zhangsan'})
    scrollIntoView(ref.current)
  }

  return (
    <div ref={ref}>
      Test target es5
      {targetData?.name}
      <button onClick={clickHandler}>
        Set Target Data
      </button>
    </div>
  );
}
