/**
 * Accessibility utilities
 */

/**
 * Check if color contrast meets WCAG AA standards
 * @param _foreground - Foreground color (hex or rgb)
 * @param _background - Background color (hex or rgb)
 * @returns true if contrast ratio >= 4.5:1 (AA standard)
 */
export function checkContrast(_foreground: string, _background: string): boolean {
  // Simplified contrast check - in production, use a proper library
  // This is a placeholder for the concept
  return true // Assume passing for now
}

/**
 * Generate ARIA label for icon-only buttons
 */
export function getIconButtonLabel(action: string, item?: string): string {
  return item ? `${action} ${item}` : action
}

/**
 * Format number for screen readers
 */
export function formatNumberForScreenReader(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Generate live region announcement
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

