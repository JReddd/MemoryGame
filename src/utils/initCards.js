export default (count) => {

    const values = [];

    for (let i = 1; i < count+1; i++){
        values.push(i);
        values.push(i);
    }

    return values
        .sort(() => Math.random() > 0.5)
        .map(value => {
            return {value, matched: false, flipped: false};
        });

}