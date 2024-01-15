export const dataRequest = {
    user: '[{"name": "Ivan", "age": 25, "city":"Moscow"}]'
}

export const getNewUser = (uuid) => {
    return  `[{"_uuid": "${uuid}", "name": "Roman", "age": 35, "city":"London"}]`
}

