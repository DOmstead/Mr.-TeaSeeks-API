function makeTeaClippingsArray() {
  return [
    {
      id: 1,
      name: 'Strong Black Tea',
      tea_type: 'Black',
      caffeine: 'High',
      taste: 'Strong'
    },
    {
      id: 2,
      name: 'No Caffeine Green Tea',
      tea_type: 'Green',
      caffeine: 'Low',
      taste: 'Light'
    },
    {
      id: 3,
      name: 'Dragon Pearl Oolong',
      tea_type: 'Oolong',
      caffeine: 'High',
      taste: 'Strong'
    },
  ];
}

module.exports = {
  makeTeaClippingsArray,
};
