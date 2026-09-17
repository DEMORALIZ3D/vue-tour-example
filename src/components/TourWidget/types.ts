export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export interface PopoverCoords {
  top: number;
  left: number;
  actualPlacement: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourStep {
  id?: string;
  target: string;                // CSS selector (e.g. '[data-tour="search-bar"]')
  title: string;                 // Step headline
  content: string;               // Instructional text
  placement?: TourPlacement;     // Preferred placement (defaults to 'bottom' or 'auto')
  offset?: number;               // Distance from target in px (default: 12)
  scrollPadding?: number;        // Padding when scrolling into view (default: 80)
}
