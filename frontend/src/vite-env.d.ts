/// <reference types="vite/client" />

declare module '@midnight-ntwrk/dapp-connector-api' {
  export interface DAppConnectorAPI {
    apiVersion: string;
    name: string;
    icon: string;
    enable: () => Promise<any>;
    isEnabled: () => Promise<boolean>;
  }
}

declare module '@midnight-ntwrk/midnight-js-network-id' {
  export type NetworkId = 'undeployed' | 'preview' | 'preprod';
}

declare module '@midnight-ntwrk/midnight-js-network-provider' {
  export interface NetworkProvider {
    getNetworkId: () => Promise<string>;
  }
}
