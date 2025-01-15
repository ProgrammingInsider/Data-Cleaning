import React from 'react'

const Progress = ({progress}:{progress:number}) => {
    const progressNumber = Number(progress);

  return (
    <div className='mb-6 w-full'>
        <div className='flex justify-between items-center'>
        <h4>Progress</h4>
        <h4>{progress}%</h4>
        </div>
        <div className='h-1 w-full relative progressBg'>
        <div 
            className={`absolute top-0 left-0 w-[${progressNumber}%] h-full progressCount`}
            style={{ width: `${progress}%` }}
        ></div>
        </div>
    </div>
  )
}

export default Progress