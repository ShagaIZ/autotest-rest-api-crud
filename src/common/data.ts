export const dataRequest = {
    userOne: '[{"name": "Ivan", "age": 25, "city":"Moscow"}]',
    userTwo: '[{"name": "Dan", "age": 45, "city":"Chicago"}]'
}

export const getNewUser = (uuid) => {
    return  `[{"_uuid": "${uuid}", "name": "Roman", "age": 35, "city":"London"}]`
}

