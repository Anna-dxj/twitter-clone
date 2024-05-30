export function hideEl(el) {
    el.classList.add('hidden');
}

export function showEl(el) {
    el.classList.remove('hidden')
}

export function removeAt(string) {
    return string.substring(1)
}