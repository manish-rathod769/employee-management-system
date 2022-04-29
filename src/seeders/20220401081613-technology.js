module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Technologies',
    [
      {
        id: 1,
        techName: 'Java',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        techName: 'C++',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        techName: 'C#',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        techName: 'Objective-C',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        techName: 'Perl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        techName: 'PHP',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        techName: 'RubyonRails',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        techName: 'Android',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        techName: 'iOS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        techName: 'HTML',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        techName: 'XML',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        techName: 'ReactJs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 13,
        techName: 'ReactNative',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 14,
        techName: 'JavaScript',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 15,
        techName: 'python',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 16,
        techName: 'NodeJs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 17,
        techName: 'MongoDB',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 18,
        techName: 'viwJs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 19,
        techName: 'UI/UX',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {},
  ),

  down: queryInterface => queryInterface.bulkDelete('Technologies', null, {}),
};
