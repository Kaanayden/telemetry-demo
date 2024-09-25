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
  EdgeProps<Edge<{ startLabel: string; endLabel: string }>>
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
        {data.startLabel && (
            <EdgeLabel
                transform={`translate(-50%, 0%) translate(${sourceX}px,${sourceY}px)`}
                label={data.startLabel}
            />
        )}
        {data.endLabel && (
            <EdgeLabel
                transform={`translate(-50%, -35%) translate(${labelX}px,${labelY}px)`}
                label={data.endLabel}
            />
        )}
    </EdgeLabelRenderer>}
    </>
  );
};

export default CustomEdge;
