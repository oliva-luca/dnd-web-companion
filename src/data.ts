import { Item, Jugador } from './types';

export const itemsMock: Item[] = [
  {
    id: 1,
    nombre: 'Espada de Fuego',
    cantidad: 1,
    peso: 5.2,
    valor: 500,
    categoria: 'Armas',
  },
  {
    id: 2,
    nombre: 'Escudo de Hielo',
    cantidad: 1,
    peso: 8.5,
    valor: 450,
    categoria: 'Armaduras',
  },
  {
    id: 3,
    nombre: 'Poción de Vida',
    cantidad: 5,
    peso: 0.5,
    valor: 100,
    categoria: 'Provisiones',
  },
  {
    id: 4,
    nombre: 'Gema Mágica',
    cantidad: 1,
    peso: 0.1,
    valor: 1000,
    categoria: 'Misc',
  },
  {
    id: 5,
    nombre: 'Botas Voladoras',
    cantidad: 1,
    peso: 2.0,
    valor: 750,
    categoria: 'Armas',
  },
  {
    id: 5,
    nombre: 'Botas Voladoras',
    cantidad: 1,
    peso: 2.0,
    valor: 750,
    categoria: 'Armas',
  },
  {
    id: 6,
    nombre: 'Botas Voladoras',
    cantidad: 1,
    peso: 2.0,
    valor: 750,
    categoria: 'Armas',
  },
  {
    id: 7,
    nombre: 'Botas Voladoras',
    cantidad: 1,
    peso: 2.0,
    valor: 750,
    categoria: 'Armas',
  },
];

// Cada jugador tiene su propio inventario (subset de itemsMock)
export const jugadoresMock: Jugador[] = [
  {
    id: 1,
    nombre: 'Aragorn',
    inventario: [
      itemsMock[0],
      itemsMock[1],
      itemsMock[2],
      itemsMock[1],
      itemsMock[2],
      itemsMock[1],
      itemsMock[2],
      itemsMock[1],
      itemsMock[2],
      itemsMock[1],
      itemsMock[2],
      itemsMock[1],
      itemsMock[2]
    ],
  },
  { id: 2, nombre: 'Legolas', inventario: [itemsMock[1], itemsMock[4]] },
  { id: 3, nombre: 'Gimli', inventario: [itemsMock[2], itemsMock[3]] },
  {
    id: 4,
    nombre: 'Gandalf',
    inventario: [itemsMock[3], itemsMock[0], itemsMock[4]],
  },
  { id: 5, nombre: 'Frodo', inventario: [itemsMock[2]] },
];

