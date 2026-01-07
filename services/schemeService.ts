
import { MOCK_SCHEMES } from '../constants';
import { Scheme } from '../types';

export const fetchAllSchemes = async (): Promise<Scheme[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_SCHEMES;
};

export const fetchSchemeById = async (id: string): Promise<Scheme | null> => {
  return MOCK_SCHEMES.find(s => s.id === id) || null;
};
