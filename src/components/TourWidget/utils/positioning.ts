import type { ElementRect, PopoverCoords, TourPlacement } from '../types';

export interface CalculatePositionOptions {
  targetRect: ElementRect;
  popoverRect: { width: number; height: number };
  preferredPlacement?: TourPlacement;
  offset?: number;
  viewportPadding?: number;
}

/**
 * Calculates optimal popover coordinates relative to the viewport.
 * Automatically flips placement if there isn't enough space on the requested side,
 * and clamps horizontal/vertical coordinates so the card never spills off-screen.
 */
export function calculatePopoverPosition(options: CalculatePositionOptions): PopoverCoords {
  const {
    targetRect,
    popoverRect,
    preferredPlacement = 'bottom',
    offset = 12,
    viewportPadding = 16
  } = options;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceTop = targetRect.top - offset - viewportPadding;
  const spaceBottom = vh - targetRect.bottom - offset - viewportPadding;
  const spaceLeft = targetRect.left - offset - viewportPadding;
  const spaceRight = vw - targetRect.right - offset - viewportPadding;

  let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  if (preferredPlacement === 'auto') {
    // Pick the side with the most space
    const spaces = [
      { side: 'bottom' as const, space: spaceBottom },
      { side: 'top' as const, space: spaceTop },
      { side: 'right' as const, space: spaceRight },
      { side: 'left' as const, space: spaceLeft }
    ];
    spaces.sort((a, b) => b.space - a.space);
    placement = spaces[0].side;
  } else if (preferredPlacement === 'top') {
    placement = spaceTop < popoverRect.height && spaceBottom > spaceTop ? 'bottom' : 'top';
  } else if (preferredPlacement === 'bottom') {
    placement = spaceBottom < popoverRect.height && spaceTop > spaceBottom ? 'top' : 'bottom';
  } else if (preferredPlacement === 'left') {
    placement = spaceLeft < popoverRect.width && spaceRight > spaceLeft ? 'right' : 'left';
  } else if (preferredPlacement === 'right') {
    placement = spaceRight < popoverRect.width && spaceLeft > spaceRight ? 'left' : 'right';
  }

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = targetRect.top - popoverRect.height - offset;
      left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
      break;

    case 'bottom':
      top = targetRect.bottom + offset;
      left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
      break;

    case 'left':
      top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
      left = targetRect.left - popoverRect.width - offset;
      break;

    case 'right':
      top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
      left = targetRect.right + offset;
      break;
  }

  // Viewport edge collision clamping
  const minLeft = viewportPadding;
  const maxLeft = Math.max(minLeft, vw - popoverRect.width - viewportPadding);
  left = Math.min(Math.max(left, minLeft), maxLeft);

  const minTop = viewportPadding;
  const maxTop = Math.max(minTop, vh - popoverRect.height - viewportPadding);
  top = Math.min(Math.max(top, minTop), maxTop);

  return {
    top,
    left,
    actualPlacement: placement
  };
}
