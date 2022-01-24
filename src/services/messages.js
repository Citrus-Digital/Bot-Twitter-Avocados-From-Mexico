const messages = require('../constants/messages');
const { getRandomIntInclusive } = require('./utils');

const getTriggers = (date = null) => {
    if ( !date ) {
        return [];
    }
    
    const today = new Date(date).getTime();

    return messages.filter(m => {
        const result = m.responses.find(response => {
            if (today > new Date(response.start).getTime() && today < new Date(response.end).getTime()) {
                return response;
            }
        })

        if ( result ) {
            return m.result = result;
        }
    });
}

const getResponses = (responses) => {
    const response = responses[getRandomIntInclusive(0, responses.length - 1)];
    return response;
}

module.exports = {
    getTriggers,
    getResponses
};