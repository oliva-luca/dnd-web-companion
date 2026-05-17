import { Item, Jugador } from './types';

export const itemsMock: Item[] = [
  {
    id: 1,
    nombre: 'Espada de Fuego',
    cantidad: 1,
    peso: 5.2,
    valor: 500,
    categoria: 'Arma',
  },
  {
    id: 2,
    nombre: 'Escudo de Hielo',
    cantidad: 1,
    peso: 8.5,
    valor: 450,
    categoria: 'Armadura',
  },
  { id: 3, nombre: 'Poción de Vida', cantidad: 5, peso: 0.5, valor: 100, categoria: 'Provisiones' },
  { id: 4, nombre: 'Gema Mágica', cantidad: 1, peso: 0.1, valor: 1000, categoria: 'Misc' },
  {
    id: 5,
    nombre: 'Botas Voladoras',
    cantidad: 1,
    peso: 2.0,
    valor: 750,
    categoria: 'Arma',
  },
];

export const jugadoresMock: Jugador[] = [
  { id: 1, nombre: 'Aragorn' },
  { id: 2, nombre: 'Legolas' },
  { id: 3, nombre: 'Gimli' },
  { id: 4, nombre: 'Gandalf' },
  { id: 5, nombre: 'Frodo' },
];

