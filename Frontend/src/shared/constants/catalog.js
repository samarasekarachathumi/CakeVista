export const CATEGORY_GROUPS = {
  flavors: ['Chocolate', 'Vanilla', 'Red Velvet', 'Strawberry', 'Black Forest'],
  occasions: ['Birthday', 'Anniversary', 'Wedding'],
  dietary: ['Eggless', 'Sugar-free', 'Vegan'],
  styles: ['Custom', 'Photo Cake', 'Cupcakes'],
}

export const ALL_CATEGORIES = [
  ...CATEGORY_GROUPS.flavors,
  ...CATEGORY_GROUPS.occasions,
  ...CATEGORY_GROUPS.dietary,
  ...CATEGORY_GROUPS.styles,
]


