import {useState} from 'react'
import Upload from './Upload'
import DefineSchema from './DefineDataTypes'
import { SchemaType } from '@/utils/types'
import StepIndicator from './StepIndicator'

const Modals = ({
    setShowOverlay,
    step,
    setStep,
    revalidateProjects,
    setRevalidateProjects
}:{ 
    setShowOverlay:React.Dispatch<React.SetStateAction<boolean>>
    step:number, 
    setStep:React.Dispatch<React.SetStateAction<number>>,
    revalidateProjects:boolean,
    setRevalidateProjects:React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [schemaDefinition, setSchemaDefinition] = useState<SchemaType | null>(null);

  return (
    <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-scroll pt-40 sm:pt-10 md:pt-0 custom-scrollbar"
  >
      <div className="flex flex-col gap-3 sectionBg w-11/12 max-w-3xl rounded-lg my-6 overflow-y-auto max-h-[90vh] custom-scrollbar relative">

        <StepIndicator step={step}/>
        
        <div className="flex flex-col justify-center items-center">
          {step === 1 && <Upload setShowOverlay={setShowOverlay} setRevalidateProjects={setRevalidateProjects} revalidateProjects={revalidateProjects} setStep={setStep} schemaDefinition={schemaDefinition} setSchemaDefinition={setSchemaDefinition} />}
          {(step === 2 || step === 3) && <DefineSchema setShowOverlay={setShowOverlay} schemaDefinition={schemaDefinition} setStep={setStep} step={step}  />}
        </div>
      </div>
  </div>
  )
}

export default Modals