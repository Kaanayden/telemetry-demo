import React, { FC } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  Edge,
} from '@xyflow/react';

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: string; label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        background: 'transparent',
        padding: 10,
        color: '#eaa710',
        fontSize: 12,
        fontWeight: 700,
        transform,
      }}
      className="nodrag nopan"
    >
      {label}
    </div>
  );
}

const CustomEdge: FC<
  EdgeProps<Edge<{ startLabel: string; endLabel: string, isHover: boolean | undefined }>>
> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd}/>
    <EdgeLabelRenderer>
        {data?.startLabel && (
            <EdgeLabel
                transform={`translate(-50%, 0%) translate(${sourceX}px,${sourceY}px)`}
                label={data.startLabel}
            />
        )}
        {data?.endLabel && (
            <div
            style={{
              opacity: data?.isHover ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            >
            <EdgeLabel
              transform={`translate(-35%, -35%) translate(${labelX}px,${labelY}px) scale(1.5)`}
              label={data.endLabel}
            />
            </div>
        )}
    </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
