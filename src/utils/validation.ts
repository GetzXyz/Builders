import { BuildResponse, ComponentSelection } from '@/types/build';

export function validateBuildResponse(data: any): BuildResponse {
  const requiredFields = ['name', 'tier', 'totalPrice', 'currency', 'components', 'summary'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const componentCategories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'cooler', 'case', 'monitor'];
  for (const category of componentCategories) {
    if (!data.components[category]) {
      console.warn