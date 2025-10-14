/// <reference types="vite/client" />

import { Buffer } from 'buffer';
import type process from 'process';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
  }
}
