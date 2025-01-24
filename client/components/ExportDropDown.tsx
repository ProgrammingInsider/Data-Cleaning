import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"
import ExportToPDF from "./ExportToPDF"

function ExportDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
              className='primaryBg primaryBtnTxt transition-all duration-300 hover:brightness-110 active:brightness-90 flex items-center gap-2'
              style={{
                background: 'linear-gradient(to right, #FF4A38, #FF9B0C)',
                color: '#FFFFFF',
              }}
            >
              <Download />
              Export Report
            </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 sectionBg">
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <ExportToPDF exportContentId="reportContent" fileName="ErrorDetectionReport" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default ExportDropdown;