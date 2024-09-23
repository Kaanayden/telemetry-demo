const MIN_X = 280;
const MIN_Y = 170;
const HORIZONTAL_RATIO = 9 / 12;

const MID_Y = 310;

const NODE_WIDTH = 192;
const NODE_HEIGHT = 96;
const HANDLE_WIDTH = 2.5;

const INITIAL_X = 0;
// const INITIAL_Y = 0;

// according to top position

function horizontalToVerticalHandle(xDiff, yDiff, sourceX) {
  let sourceHandle;
  let targetHandle;
  if (yDiff > 0 && xDiff > 0 && sourceX > INITIAL_X) {
    sourceHandle = 'right';
    targetHandle = 'top';
  } else if (yDiff > 0 && xDiff > 0 && sourceX < INITIAL_X) {
    sourceHandle = 'bottom';
    targetHandle = 'left';
  } else if (yDiff > 0 && xDiff < 0 && sourceX < INITIAL_X) {
    sourceHandle = 'left';
    targetHandle = 'top';
  } else if (yDiff > 0 && xDiff < 0 && sourceX > INITIAL_X) {
    sourceHandle = 'bottom';
    targetHandle = 'right';
  } else if (yDiff < 0 && xDiff > 0 && sourceX > INITIAL_X) {
    sourceHandle = 'right';
    targetHandle = 'bottom';
  } else if (yDiff < 0 && xDiff > 0 && sourceX < INITIAL_X) {
    sourceHandle = 'top';
    targetHandle = 'left';
  } else if (yDiff < 0 && xDiff < 0 && sourceX < INITIAL_X) {
    sourceHandle = 'left';
    targetHandle = 'bottom';
  } else if (yDiff < 0 && xDiff < 0 && sourceX > INITIAL_X) {
    sourceHandle = 'top';
    targetHandle = 'right';
  }
  return { sourceHandle, targetHandle };
}

export default function calculateEdgeHandle(sourceX, sourceY, targetX, targetY) {
  let sourceHandle;
  let targetHandle;
  let newSourceX; let newSourceY;
  let newTargetX; let newTargetY;
  console.log('positions: ', sourceX, sourceY, targetX, targetY);
  const xDiff = targetX - sourceX;
  const yDiff = targetY - sourceY;

  if (Math.abs(yDiff) > MIN_Y) {
    if (yDiff > 0) {
      sourceHandle = 'bottom';
      targetHandle = 'top';
    } else {
      sourceHandle = 'top';
      targetHandle = 'bottom';
    }

    if (Math.abs(yDiff) < MID_Y && Math.abs(xDiff) > MIN_X && yDiff / xDiff < HORIZONTAL_RATIO) {
      const result = horizontalToVerticalHandle(xDiff, yDiff, sourceX);
      sourceHandle = result.sourceHandle;
      targetHandle = result.targetHandle;
    }
  } else if (xDiff > 0) {
    sourceHandle = 'right';
    targetHandle = 'left';
  } else {
    sourceHandle = 'left';
    targetHandle = 'right';
  }

  switch (sourceHandle) {
    case 'top':
      newSourceX = sourceX;
      newSourceY = sourceY + HANDLE_WIDTH;
      break;
    case 'bottom':
      newSourceX = sourceX;
      newSourceY = sourceY + NODE_HEIGHT + HANDLE_WIDTH;
      break;
    case 'left':
      newSourceX = sourceX - NODE_WIDTH / 2;
      newSourceY = sourceY + NODE_HEIGHT / 2 + HANDLE_WIDTH;
      break;
    case 'right':
      newSourceX = sourceX + NODE_WIDTH / 2;
      newSourceY = sourceY + NODE_HEIGHT / 2 + HANDLE_WIDTH;
      break;

    default:
      newSourceX = sourceX;
      newSourceY = sourceY;
  }

  switch (targetHandle) {
    case 'top':
      newTargetX = targetX;
      newTargetY = targetY + HANDLE_WIDTH;
      break;
    case 'bottom':
      newTargetX = targetX;
      newTargetY = targetY + NODE_HEIGHT + HANDLE_WIDTH;
      break;
    case 'left':
      newTargetX = targetX - NODE_WIDTH / 2; // - HANDLE_WIDTH;
      newTargetY = targetY + NODE_HEIGHT / 2 + HANDLE_WIDTH;
      break;
    case 'right':
      newTargetX = targetX + NODE_WIDTH / 2; // + HANDLE_WIDTH;
      newTargetY = targetY + NODE_HEIGHT / 2 + HANDLE_WIDTH;
      break;

    default:
      newTargetX = targetX;
      newTargetY = targetY;
  }

  return {
    newSourceX, newSourceY, newTargetX, newTargetY, sourceHandle: sourceHandle, targetHandle: targetHandle
  };
}
