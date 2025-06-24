export const dataRequest: { [key: string]: string } = {
  userOne: '[{"name": "Ivan", "age": 25, "city":"Moscow"}]',
  userTwo: '[{"name": "Dan", "age": 45, "city":"Chicago"}]',
  userThree: '{"name": "Geran", "age": 20, "city":"Ufa"}',
};

export const getNewUser = (uuid: string): string => {
  return `[{"_uuid": "${uuid}", "name": "Roman", "age": 35, "city":"London"}]`;
};
