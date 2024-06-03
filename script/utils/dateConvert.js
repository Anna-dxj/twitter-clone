export function convertDate(isoString){
    const date = new Date(isoString);

    const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const month = monthsArr[date.getMonth()]
    const day = date.getDate(); 
    const year = date.getFullYear(); 

    let hours = date.getHours(); 
    const minutes = date.getMinutes(); 
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;

    hours = hours ? hours : 12
    
    const formatedMinutes = minutes < 10 ? `0${minutes}` : minutes; 

    const formattedDate = `${day} ${month} ${year} @ ${hours}:${formatedMinutes} ${ampm}`

    return formattedDate;
}