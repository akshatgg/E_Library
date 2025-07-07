export function normalizeValue(value, min, max) {
    return (value - min) / (max - min);
}

export function denormalizeValue(value, min, max) {
    return (value * (max - min)) + min;
}