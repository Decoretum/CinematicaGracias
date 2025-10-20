export default function DataComparator(hm : Map<string, Array<object>>) : Map<string, Array<object>> {
    let map = new Map();
    for (const [key, value] of hm) {
        if (Array.isArray(value[0]) && Array.isArray(value[1])) {
            const a1 = [...value[0]].sort();
            const a2 = [...value[1]].sort();

            if (!a1.every((value, idx) => value === a2[idx])) {
                map.set(key, value[0]);
            }
        }
        else {
            if (value[0] !== value[1]) {
                map.set(key, value[0]);
            }
        }
    }
    return map;
}