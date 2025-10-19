export default function DataComparator(hm : Map<string, Array<object>>) : Map<string, Array<object>> {
    let map = new Map();
    for (const [key, value] of hm) {
        if (value[0] !== value[1]) {
            map.set(key, value[0]);
        }
    }
    return map;
}