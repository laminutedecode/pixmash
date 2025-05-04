// Export types
export * from './types';

// Export utility functions
export * from './utils/compressor';
export * from './utils/convertor';

// Export React hooks
export { default as useCompressor } from './hooks/useCompressor';
export { default as useConvertor } from './hooks/useConvertor';

// Export Vue composables
export { default as vueUseCompressor } from './composables/useCompressor';
export { default as vueUseConvertor } from './composables/useConvertor';

// Export vanilla JavaScript classes
export { default as Compressor } from './vanilla/compressor';
export { default as Convertor } from './vanilla/convertor';

// Default export for direct use
import { Compressor, Convertor } from './vanilla';

const pixmash = {
  Compressor,
  Convertor,
};

export default pixmash; 