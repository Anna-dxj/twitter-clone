export function calculateMaxPage (postNums) {
    console.log('postNums', postNums); 
    const number = Number(postNums)
    return Math.ceil(number / 10)
}