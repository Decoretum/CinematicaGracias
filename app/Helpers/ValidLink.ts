export default function ValidLink (url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}