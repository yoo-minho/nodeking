const axios = require("axios");

//const API_URL = "https://test.oilnow.co.kr"
const API_URL = "http://localhost:3000"

/**
 *
 * 가격리스트 활용 주유소 리스트 조회
 *
 * @param priceArray {array.<Number>} - 가격 리스트
 * @param [isParallel] {boolean} - 병렬 유무
 * @returns {array} - 주유소 리스트
 */
async function getStationsByPrices(priceArray, isParallel) {
    priceArray = priceArray || [];
    isParallel = isParallel || false;

    let stationArr = [];

    if (isParallel) {
        stationArr = await Promise.all(priceArray.map(getStationsByPrice));
        return stationArr.reduce((a, b) => [...a, ...b]);
    }

    for (const price of priceArray) {
        stationArr = [...stationArr, ...await getStationsByPrice(price)];
    }
    return stationArr;

    async function getStationsByPrice(price) {
        try {
            const result = await axios.get(`${API_URL}/gstation?price=${price}`);
            return result.data;
        } catch (e) {
            return [];
        }
    }
}

module.exports = {
    getStationsByPrices: getStationsByPrices,
};