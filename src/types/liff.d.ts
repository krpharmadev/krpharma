declare namespace liff {
  interface Profile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
  }

  interface LiffContext {
    isInClient: boolean;
    os: string;
    language: string;
    version: string;
    lineVersion: string;
  }

  function init(config: { liffId: string }): Promise<void>;
  function isInClient(): boolean;
  function getOS(): string;
  function getLanguage(): string;
  function getVersion(): string;
  function getLineVersion(): string;
  function getProfile(): Promise<Profile>;
} 