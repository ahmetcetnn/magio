// Global window augmentation for mobile sidebar toggle
export {};

declare global {
  interface Window {
    openMobileSidebar?: () => void;
  }
}
