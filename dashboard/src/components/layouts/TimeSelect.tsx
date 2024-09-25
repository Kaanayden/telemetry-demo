
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sinceOptions } from "@/utils/periods"



export default function TimeSelect({defaultValue} : {defaultValue: string | undefined}) {


    return (

        <Select defaultValue={defaultValue || "1"}>
            <SelectTrigger className="w-[180px] text-white bg-slate-700">
                <SelectValue  />
            </SelectTrigger>
            <SelectContent className='bg-slate-600' >
                <SelectGroup >
                    {sinceOptions.map((option) => (
                        <SelectItem className="text-white" key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}