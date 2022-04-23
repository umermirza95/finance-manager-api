export default {
    creators: {
        system: "system"
    },
    collections: {
        transactions: "transactions",
        users: "users"
    },
    currencies: {
        PKR: 'PKR',
        USD: 'USD',
        CAD: 'CAD',
        EUR: 'EUR'
    }
}


export const convertUnixToDate = (timestamp: number): string => {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    if (month.length == 1) month = "0" + month;
    let day = date.getDate().toString();
    if (day.length == 1) day = "0" + day;
    return year + "-" + month + "-" + day;
}