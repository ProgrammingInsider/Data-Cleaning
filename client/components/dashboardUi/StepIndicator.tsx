import React from 'react'

const StepIndicator = ({
  step, 
  setStep
}:{
  step:number, 
  setStep:React.Dispatch<React.SetStateAction<number>>,
}) => {
  return (
    <header className="flex flex-col gap-2 items-center w-full sticky top-0 sectionBg p-6 z-30">
        <div className="flex w-11/12 mx-auto items-center">
        <div className="flex flex-col gap-1 justify-center items-center">
            <h1 className="primaryBg p-1 text-base font-bold w-6 h-6 rounded-full flex justify-center items-center -mr-1 z-10 hover:underline" onClick={()=>setStep(1)}>1</h1>
        </div>
        <div className={`w-full h-2 rounded-full ${step === 2 ? "primaryBg" :"secondaryBg"}`}></div>
        <div className="flex flex-col gap-1 justify-center items-center">
            <h1 className={`p-1 text-base font-bold w-6 h-6 rounded-full flex justify-center items-center -ml-1 z-10 hover:underline ${step === 2 ? "primaryBg" :"secondaryBg"}`} onClick={()=>setStep(2)}>2</h1>
        </div>
        </div>
        <div className="flex justify-between w-full">
            <p className="para text-center font-medium text-nowrap text-sm">Upload File</p>
            <p className="para text-center font-medium text-nowrap text-sm">Schema Definition</p>
        </div>
    </header>
  )
}

export default StepIndicator