function makeTeaClippingsArray() {
  return [
    {
      id: 1,
      name: 'Strong Black Tea',
      tea_type: 'Black',
      caffeine: 'High',
      taste: 'Strong',
      details: 'A really good tea',
      temp: '185',
      brew_time: '2 min',
      image: 'Black_tea_green_cup.jpeg'
    },
    {
      id: 2,
      name: 'No Caffeine Green Tea',
      tea_type: 'Green',
      caffeine: 'Low',
      taste: 'Light',
      details: 'A really good tea',
      temp: '180',
      brew_time: '3 min',
      image: 'Green_tea_Black_cup.jpeg'
    },
    {
      id: 3,
      name: 'Dragon Pearl Oolong',
      tea_type: 'Oolong',
      caffeine: 'High',
      taste: 'Strong',
      details: 'A really good tea',
      temp: '190',
      brew_time: '5 min',
      image: 'Oolong_tea_red_cup.jpeg'
    },
  ];
}

module.exports = {
  makeTeaClippingsArray,
};
