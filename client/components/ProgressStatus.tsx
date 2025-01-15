import React from 'react'

const ProgressStatus = ({progress}:{progress:number}) => {
    
    let progressStatus = '';
    let progressStyle = '';
    switch (true) {
        case progress <= 10:
            progressStatus = 'Planning';
            progressStyle = "planning";
            break;
        case progress > 10 && progress <= 90:
            progressStatus = 'In Progress';
            progressStyle = "inProgress";
            break;
        case progress > 90 && progress < 100:
            progressStatus = 'In Review';
            progressStyle = "inReview";
            break;
        case progress === 100:
            progressStatus = 'Completed';
            progressStyle = "completed";
            break;
        default:
            progressStatus = 'Unknown';
            break;
    }
  return (
        <button className={`text-black font-medium text-sm py-1 px-2 inProgress rounded-lg ${progressStyle}`}>
            {progressStatus}
        </button>
  )
}

export default ProgressStatus