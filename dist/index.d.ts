export * from './types';
export * from './utils/compressor';
export * from './utils/convertor';
export { default as useCompressor } from './hooks/useCompressor';
export { default as useConvertor } from './hooks/useConvertor';
export { default as vueUseCompressor } from './composables/useCompressor';
export { default as vueUseConvertor } from './composables/useConvertor';
export { default as Compressor } from './vanilla/compressor';
export { default as Convertor } from './vanilla/convertor';
import { Compressor, Convertor } from './vanilla';
declare const pixmash: {
    Compressor: typeof Compressor;
    Convertor: typeof Convertor;
};
export default pixmash;
