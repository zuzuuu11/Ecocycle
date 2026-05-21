export interface Product {
  barcode: string;
  name: string;
  category: string;
  environmentalImpact: {
    co2: number;
    water: number;
    energy: number;
    waste: number;
  };
  sustainability: {
    recyclable: boolean;
    biodegradable: boolean;
    sustainableMaterials: boolean;
  };
  disposal: {
    method: string;
    location: string;
    specialInstructions: string;
  };
  alternatives: string[];
  benefits: string[];
}

export const productsDatabase: Product[] = [
  {
    barcode: '7894900010015',
    name: 'Garrafa PET 500ml',
    category: 'Plástico',
    environmentalImpact: {
      co2: 120,
      water: 2000,
      energy: 80,
      waste: 15
    },
    sustainability: {
      recyclable: true,
      biodegradable: false,
      sustainableMaterials: false
    },
    disposal: {
      method: 'Reciclagem',
      location: 'Posto de coleta seletiva',
      specialInstructions: 'Lavar e secar antes de descartar'
    },
    alternatives: ['Garrafa de vidro reutilizável', 'Garrafa térmica', 'Copo reutilizável'],
    benefits: ['Reciclável', 'Leve e prático', '100% reciclado em alguns países']
  },
  {
    barcode: '7891910000123',
    name: 'Papel A4 Resma',
    category: 'Papel',
    environmentalImpact: {
      co2: 5000,
      water: 10000,
      energy: 3000,
      waste: 200
    },
    sustainability: {
      recyclable: true,
      biodegradable: true,
      sustainableMaterials: true
    },
    disposal: {
      method: 'Reciclagem',
      location: 'Papelaria ou posto de coleta',
      specialInstructions: 'Separar papel úmido de seco'
    },
    alternatives: ['Papel reciclado', 'Bloco de notas digital', 'Agenda eletrônica'],
    benefits: ['Biodegradável', 'Reciclável', 'Feito com materiais sustentáveis']
  },
  {
    barcode: '7893000123456',
    name: 'Pilha Alcalina AA',
    category: 'Eletrônico',
    environmentalImpact: {
      co2: 800,
      water: 500,
      energy: 200,
      waste: 50
    },
    sustainability: {
      recyclable: true,
      biodegradable: false,
      sustainableMaterials: false
    },
    disposal: {
      method: 'Coleta especializada',
      location: 'Lojas especializadas ou postos de eletrônicos',
      specialInstructions: 'Não descartar em lixo comum - contém metais pesados'
    },
    alternatives: ['Baterias recarregáveis', 'Energia solar portátil'],
    benefits: ['Longa duração', 'Amplamente disponível']
  },
  {
    barcode: '7896000147890',
    name: 'Embalagem de Alumínio',
    category: 'Metal',
    environmentalImpact: {
      co2: 200,
      water: 1500,
      energy: 150,
      waste: 5
    },
    sustainability: {
      recyclable: true,
      biodegradable: false,
      sustainableMaterials: false
    },
    disposal: {
      method: 'Reciclagem',
      location: 'Posto de coleta seletiva',
      specialInstructions: 'Lavar e amassar para economizar espaço'
    },
    alternatives: ['Embalagens reutilizáveis', 'Vidro', 'Papel biodegradável'],
    benefits: ['100% reciclável infinitamente', 'Leve', 'Não enferruja']
  },
  {
    barcode: '7891234567890',
    name: 'Saco Plástico de Lixo',
    category: 'Plástico',
    environmentalImpact: {
      co2: 50,
      water: 300,
      energy: 30,
      waste: 100
    },
    sustainability: {
      recyclable: false,
      biodegradable: false,
      sustainableMaterials: false
    },
    disposal: {
      method: 'Aterro sanitário',
      location: 'Lixo comum',
      specialInstructions: 'Evitar uso - optar por sacolas reutilizáveis'
    },
    alternatives: ['Sacos de pano', 'Sacos de papel', 'Caixas de papelão'],
    benefits: ['Prático', 'Higiênico', 'Barato']
  }
];

export function findProductByBarcode(barcode: string): Product | null {
  return productsDatabase.find(product => product.barcode === barcode) || null;
}
