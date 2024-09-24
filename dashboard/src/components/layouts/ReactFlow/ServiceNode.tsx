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
        <div className='serviceNodeContainer w-48 h-24 border-2 border-gray-500 bg-[#1A192B] py-8 px-2 flex flex-col justify-center items-center rounded-md hover:bg-slate-700' >
        <Handle
          isConnectableStart
          isConnectableEnd
          className="absolute bottom-0 left-24 invisible"
          position={Position.Bottom}
          id="bottom"
          type='source'
        />
        <Handle
          isConnectableStart
          isConnectableEnd
          className="absolute top-0 left-24 invisible"
          position={Position.Top}
          id="top"
          type='source'
        />
        <Handle
          isConnectableStart
          isConnectableEnd
          className="absolute top-12 left-0 invisible"
          position={Position.Left}
          id="left"
          type='source'
        />
        <Handle
          isConnectableStart
          isConnectableEnd
          className="absolute top-12 right-0 invisible"
          position={Position.Right}
          id="right"
          type='source'
        />
            <div className='text-center text-xl'>{data.service.ServiceName}</div>

        </div>
    );
};

export default ServiceNode;