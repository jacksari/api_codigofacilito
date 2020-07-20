function bulidParams(validParams, body) {
    let params = {};

    validParams.forEach(attr => {
        //console.log('attr:', attr);

        if (Object.prototype.hasOwnProperty.call(body, attr))
            params[attr] = body[attr];
        //console.log('attr', attr);
    });
    return body
}

module.exports = { bulidParams };