export enum DATA_TYPE {
  TEXT,
  PAUSE,
  DELETE,
  REMOVE,
  ADD,
}

export type DYNAMIC_VALUE = string | number | boolean;

export type INPUT_DATA = {
  id: number;
  type: DATA_TYPE;
  label: string;
  value: DYNAMIC_VALUE;
};

export type ITEM_TABLE = INPUT_DATA[];

type INPUT_TYPE = {
  id: number;
  type: DATA_TYPE;
  label: string;
  description: string;
};

export const INPUTS = [
  {
    id: 0,
    type: DATA_TYPE.TEXT,
    label: 'Texte',
    description: '\nTexte à afficher sur une ligne.',
  },
  {
    id: 1,
    type: DATA_TYPE.PAUSE,
    label: 'Pause',
    description: '\nTemps de pause avant la prochaine action en milliseconde.',
  },
  {
    id: 2,
    type: DATA_TYPE.DELETE,
    label: 'Suppression',
    description: '\nSpécifier le nombre de caractères à supprimer.',
  },
  {
    id: 3,
    type: DATA_TYPE.REMOVE,
    label: 'Supprimer la bulle',
    description: '\nSpécifier la vitesse de suppression en milliseconde.',
  },
  {
    id: 4,
    type: DATA_TYPE.ADD,
    label: 'Nouvelle Bulle',
    description: '\nCréer une nouvelle bulle de dialogue, par défaut à droite.',
  },
];

export function getInputTypeFromID(inputId: number): INPUT_TYPE {
  return INPUTS.filter((type) => type.id === inputId)[0];
}
