export function distance(a, b) {
    return Math.sqrt(Math.pow(a.left - b.left, 2) + Math.pow(a.top - b.top, 2));
}