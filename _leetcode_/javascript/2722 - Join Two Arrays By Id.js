/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */

var join = function(arr1, arr2) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
    let map = {}
    for(let o of arr1) map[o.id] = o;
    for(let o of arr2){
        if(map[o.id]) map[o.id] = {...map[o.id], ...o}
        else map[o.id] = o;
    }
    return Object.values(map);
};

var join = function (arr1, arr2) {
    const map = new Map();
    for (const o of arr1) map.set(o.id, o);
    for (const o of arr2) {
        if (!map.has(o.id)) map.set(o.id, o)
        else {
            const prevEntry = map.get(o.id);
            // very nice.
            /*
                if the ID already exists in the map, we retrieve the existing object using map.get (obj.id). We then iterate over each property of the current object using Object.keys(obj).
                For each property, we update the corresponding property of the existing object with the value from the current object. This merging process ensures that values from arr2 override values from arr1 when the objects share the same ID.
            */
            for (const key of Object.keys(o)) prevEntry[key] = o[key] // override property else set above.
        }
    }
    const mergedValueMapIterator = map.values();
    // this will not sort ..
    // so we gotta sort...
    // sigh
    return Array.from(mergedValueMapIterator).sort((a, b) => a.id - b.id)

}