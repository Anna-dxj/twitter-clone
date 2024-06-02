export function calculateMaxPage (postNums) {
    const number = Number(postNums)
    return Math.ceil(number / 10)
}