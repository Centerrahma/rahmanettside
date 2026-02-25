import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  return {
    locale: 'no',
    messages: (await import('./messages/no.json')).default,
  };
});
