const getTimeNow = (isShort = false, withHours = false, date = new Date()) => {
    let seconds   = '00';
    let minutes   = '00';
    let hours     = '00';

    if ( withHours ) {
        seconds   = formatDateAttr(parseInt(date.getSeconds()));
        minutes   = formatDateAttr(parseInt(date.getMinutes()));
        hours     = formatDateAttr(parseInt(date.getHours()));
    }

    const day       = formatDateAttr(parseInt(date.getDate()));
    const month     = formatDateAttr(parseInt(date.getMonth()) + 1);
    const year      = date.getUTCFullYear();

    if( isShort ) {
        return `${year}-${month}-${day}`;
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const formatDateAttr = (value) => {
    return value < 10 ? `0${value}` : value;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports =  {
    getTimeNow,
    getRandomIntInclusive,
    sleep
}
