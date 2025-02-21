// IssuesSection.tsx
import { useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaBoxTissue } from "react-icons/fa";
import SmallLoading from "@/components/SmallLoading";

interface IssueType {
  row: number;
  errors: string[];
}

interface IssuesSectionProps {
  issues: IssueType[];
  isCleanDataLoading: boolean;
  setSelectedRow: (index: number) => void;
}

export default function IssuesSection({ issues, isCleanDataLoading, setSelectedRow }: IssuesSectionProps) {
  const [isIssueOpen, setIsIssueOpen] = useState(true);
  const totalErrors = issues.reduce((sum, issue) => sum + issue.errors.length, 0);

  return (
    <div>
      <button onClick={() => setIsIssueOpen(!isIssueOpen)} className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition">
        <span className="text-sm para">Issues&nbsp;({totalErrors})</span>
        {isIssueOpen ? <IoChevronDown /> : <IoChevronForward />}
      </button>

      {isIssueOpen && (
        <ul className="mt-2 space-y-2 overflow-y-auto overflow-x-hidden">
          {isCleanDataLoading ? (
            <div className="flex justify-center py-2"><SmallLoading /></div>
          ) : (
            issues.length > 0 ? (
              issues.map((eachIssue, index) => (
                <li
                  key={index}
                  className="px-4 py-2 shadow-sm cursor-pointer transition relative hover:secondaryBg"
                  style={{ color: "hsl(var(--sidebar-primary-foreground))" }}
                  onClick={() => setSelectedRow(eachIssue.row)}
                >
                  <div>
                    <span className="flex items-center text-sm gap-1 truncate font-bold">
                      <FaBoxTissue />
                      Row {eachIssue.row}<span className="para text-xs font-light">({eachIssue.errors.length})</span>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div className="p-2 rounded-lg text-wrap text-sm max-w-[80%] mr-auto bg-secondary text-secondary-foreground">No Issues Found</div>
            )
          )}
        </ul>
      )}
    </div>
  );
}
