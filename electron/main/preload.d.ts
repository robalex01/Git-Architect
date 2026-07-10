declare global {
  interface Window {
    __electron?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

export {};

