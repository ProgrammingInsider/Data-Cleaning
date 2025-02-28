// import {error} from "../../utils/types";
// // Tooltip.tsx
// export const Tooltip = ({ issues, cursorPosition, isTooltipAbove }: { issues:error[]; cursorPosition: { x: number; y: number }; isTooltipAbove: boolean; }) => (
//     <ul
//       className={`fixed border border-gray-300 rounded-lg p-2 font-light text-sm z-50 bg-secondary text-secondary-foreground ${isTooltipAbove ? "before:bottom-[-5px]" : "before:top-[-5px]"} before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border-l before:border-t before:border-gray-300 before:rotate-45`}
//       style={{ top: `${cursorPosition.y}px`, left: `${cursorPosition.x}px`, whiteSpace: "nowrap" }}
//     >
//       <h4>({issues.length}) Issues in this row</h4>
//       {issues.map((error, idx) => (
//         <li key={idx} className="ml-4 list-disc">
//           {/* On column <b>{error.split(":")[1]}:&nbsp;</b>{error.split(":")[0]} */}
//           On column <b>{error.column}:&nbsp;</b>{error.issueType}
//         </li>
//       ))}
//     </ul>
//   );


import ReactDOM from "react-dom";
import { error } from "../../utils/types";

export const Tooltip = ({
  issues,
  cursorPosition,
  isTooltipAbove,
}: {
  issues: error[];
  cursorPosition: { x: number; y: number };
  isTooltipAbove: boolean;
}) => {
  const tooltip = (
    <ul
      className={`fixed border border-gray-300 rounded-lg p-2 font-light text-sm z-50 bg-secondary text-secondary-foreground ${
        isTooltipAbove ? "before:bottom-[-5px]" : "before:top-[-5px]"
      } before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border-l before:border-t before:border-gray-300 before:rotate-45`}
      style={{ top: `${cursorPosition.y}px`, left: `${cursorPosition.x}px`, whiteSpace: "nowrap" }}
    >
      <h4>({issues.length}) Issues in this row</h4>
      {issues.map((error, idx) => (
        <li key={idx} className="ml-4 list-disc">
          On column <b>{error.column}:&nbsp;</b>
          {error.issueType}
        </li>
      ))}
    </ul>
  );

  return ReactDOM.createPortal(tooltip, document.body);
};
