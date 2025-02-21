// DatasetsSection.tsx
import { useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaFileAlt, FaPlus } from "react-icons/fa";
import Link from "next/link";
import SmallLoading from "@/components/SmallLoading";
import { projectType } from "../../utils/types";

interface DatasetsSectionProps {
  projects: projectType[];
  loading: boolean;
  cleanDataFileId: string;
}

export default function DatasetsSection({ projects, loading, cleanDataFileId }: DatasetsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition">
        <span className="text-sm para">Datasets&nbsp;({projects.length})</span>
        {isOpen ? <IoChevronDown /> : <IoChevronForward />}
      </button>

      {isOpen && (
        <ul className="mt-2 space-y-2">
          {loading ? (
            <div className="flex justify-center py-2"><SmallLoading /></div>
          ) : (
            projects.map((file, index) => (
              <li
                key={index}
                className={`flex items-center justify-between px-4 py-2 shadow-sm cursor-pointer transition relative ${(cleanDataFileId === file.file_id) ? "secondaryBg" : ""} hover:secondaryBg`}
                style={{ color: "hsl(var(--sidebar-primary-foreground))" }}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(-1)}
              >
                <Link href={`/cleandata/${file.file_id}`}>
                  <span className="flex items-center text-sm gap-2 truncate">
                    <FaFileAlt />
                    {file.original_name}
                  </span>
                </Link>
                {active === index && <div className="absolute right-0 text-sm p-1 rounded-full z-10 sectionBg"><FaPlus /></div>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}