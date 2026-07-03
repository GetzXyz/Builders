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
      console.warn(`Missing component category: ${category}`);
    }
  }

  for (const [category, component] of Object.entries(data.components)) {
    validateComponent(category, component as ComponentSelection);
  }

  return data as BuildResponse;
}

function validateComponent(category: string, component: ComponentSelection) {
  if (!component.name || typeof component.name !== 'string') {
    throw new Error(`Invalid component name in category: ${category}`);
  }
  if (typeof component.price !== 'number' || component.price < 0) {
    throw new Error(`Invalid component price in category: ${category}`);
  }
}