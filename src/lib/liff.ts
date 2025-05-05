import liff from '@line/liff';

export const isLineLiff = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.href.includes('liff.line.me');
};

export const initializeLiff = async (): Promise<void> => {
  if (!process.env.NEXT_PUBLIC_LIFF_ID) {
    throw new Error('LIFF ID is not defined');
  }

  try {
    await liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    });
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    throw error;
  }
};

export const getLiffContext = () => {
  if (!liff.isInClient()) {
    return {
      isInClient: false,
      os: 'web',
      language: 'th',
      version: '2.0',
      lineVersion: '2.0',
    };
  }

  return {
    isInClient: true,
    os: liff.getOS(),
    language: liff.getLanguage(),
    version: liff.getVersion(),
    lineVersion: liff.getLineVersion(),
  };
}; 