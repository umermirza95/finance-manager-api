const fetch = require('node-fetch');

const baseUrl = "https://api.transferwise.com/v1";

export const getCurrentExchangeRate = (exchangeFrom: string, exchangeTo: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = await fetch(baseUrl + "/rates?source=" + exchangeFrom + "&target=" + exchangeTo, {
                headers: { Authorization: 'Bearer ' + process.env.WISE_API_KEY }
            });
            const res = JSON.parse(await req.text());
            resolve(res[0].rate);
        }
        catch (error) {
            reject(error);
        }
    });
}

export const getHistoricExchangeRate = async (exchangeFrom: string, exchangeTo: string, date: string): Promise<number> => {
    try {
        const req = await fetch(baseUrl + "/rates?source=" + exchangeFrom + "&target=" + exchangeTo + "&time=" + date, {
            headers: { Authorization: 'Bearer ' + process.env.WISE_API_KEY }
        });
        const res = JSON.parse(await req.text());
        return (res[0].rate);
    }
    catch (error) {
        throw ("Failed to get historic exchange rate");
    }
}
