// hooks/useScrollToContent.ts
import { useCallback, useRef } from 'react';

interface ScrollOptions {
  behavior?: 'smooth' | 'instant' | 'auto';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  offset?: number; // Additional offset from top
  delay?: number; // Delay before scrolling
}

export const useScrollToContent = () => {
  // Fix: Use number type for browser setTimeout, or ReturnType<typeof setTimeout>
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToElement = useCallback(
    (elementId: string, options: ScrollOptions = {}) => {
      const {
        behavior = 'smooth',
        block = 'center',
        inline = 'nearest',
        offset = 80, // Default offset for header space
        delay = 100,
      } = options;

      // Clear any existing timeout
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Use setTimeout to ensure DOM has updated
      scrollTimeoutRef.current = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          if (offset !== 0) {
            // Custom scroll with offset
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const finalPosition = Math.max(0, absoluteElementTop - offset);

            window.scrollTo({
              top: finalPosition,
              behavior: behavior,
            });
          } else {
            // Standard scroll into view
            element.scrollIntoView({
              behavior,
              block,
              inline,
            });
          }
        }
      }, delay);
    },
    []
  );

  const scrollToProjectItem = useCallback(
    (projectId: string, options: ScrollOptions = {}) => {
      scrollToElement(`project-${projectId}`, {
        offset: 100,
        ...options,
      });
    },
    [scrollToElement]
  );

  const scrollToPosition = useCallback(
    (position: number, options: ScrollOptions = {}) => {
      const { behavior = 'smooth', delay = 150 } = options;

      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        // Find the element at the specific position
        const projectElements = document.querySelectorAll(
          '[data-project-index]'
        );
        const targetElement = Array.from(projectElements).find(
          (el) =>
            parseInt((el as HTMLElement).dataset.projectIndex!) >= position
        );

        if (targetElement) {
          const elementRect = targetElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const finalPosition = Math.max(0, absoluteElementTop - 100);

          window.scrollTo({
            top: finalPosition,
            behavior,
          });
        }
      }, delay);
    },
    []
  );

  const scrollToNewContent = useCallback(
    (contentId: string, options: ScrollOptions = {}) => {
      const { delay = 200 } = options;

      scrollToElement(contentId, {
        offset: 80,
        block: 'center',
        delay,
        ...options,
      });

      // Add highlight effect
      setTimeout(() => {
        const element = document.getElementById(contentId);
        if (element) {
          element.classList.add('highlight-new-content');
          setTimeout(() => {
            element.classList.remove('highlight-new-content');
          }, 2000);
        }
      }, delay + 100); // Wait for scroll to start before highlighting
    },
    [scrollToElement]
  );

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (scrollTimeoutRef.current !== null) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  return {
    scrollToElement,
    scrollToProjectItem,
    scrollToPosition,
    scrollToNewContent,
    cleanup,
  };
};
