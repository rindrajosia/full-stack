const isNameNotEmpty = (name) => {
    if(name === '') {
      return false;
    }

    return true;
}

const isNameUnique = (name, array) => {
    const pers = array.find(n => n.name.toUpperCase() === name.toUpperCase());

    if(pers) {
      return false;
    }

    return true;
}

module.exports = { isNameNotEmpty, isNameUnique }
