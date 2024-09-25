
"use client"

import { useRouter } from 'next/navigation';
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


export default function TimeSelect({ defaultValue, serviceName }: { defaultValue: string | undefined, serviceName: string }) {
    const router = useRouter()

    const handleChange = (value: string) => {
        router.push(
            `/${serviceName}?since=${value}`,)
    }

    return (

        <Select onValueChange={handleChange} defaultValue={defaultValue || "1"}>
            <SelectTrigger className="w-[180px] text-white bg-slate-700">
                <SelectValue />
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