// esto domas funcionara si los tokens no tiene httponly que es una medida de segurdad
import Cookies from 'js-cookie';

export const getAccessToken = () => Cookies.get('access_token');
export const getRefreshToken = () => Cookies.get('refresh_token');

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token && token.length > 10; // mínima validación de formato
};