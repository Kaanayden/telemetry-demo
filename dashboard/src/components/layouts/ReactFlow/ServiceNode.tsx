import React from 'react';
import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface ServiceNodeProps {
    data: {
        service: {
            ServiceName: string;
        }

    };
}

const ServiceNode = ({ data } : ServiceNodeProps) => {
    console.log("hey", data)
    return (
        <div className='w-48 h-24 border-2 border-gray-500 bg-[#1A192B] py-8 px-2 flex flex-col justify-center items-center rounded-md hover:bg-slate-700' >
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
            <div className='text-center text-xl'>{data.service.ServiceName}</div>

        </div>
    );
};

export default ServiceNode;