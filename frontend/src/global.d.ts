/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';