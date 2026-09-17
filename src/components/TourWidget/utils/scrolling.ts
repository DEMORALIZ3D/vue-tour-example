/**
 * Checks if a DOM element is fully visible in the viewport.
 */
export function isElementInViewport(element: HTMLElement, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= threshold &&
    rect.left >= threshold &&
    rect.bottom <= (window.innerHeight - threshold) &&
    rect.right <= (window.innerWidth - threshold)
  );
}

/**
 * Smoothly scrolls an element into view only if it is outside the viewport.
 * Uses block: 'nearest' so it never pushes the page into empty space.
 */
export function smoothScrollToElement(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (isElementInViewport(element)) {
      resolve();
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });

    // Resolve after scroll animation finishes
    setTimeout(() => {
      resolve();
    }, 350);
  });
}

