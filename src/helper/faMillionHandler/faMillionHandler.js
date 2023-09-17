export const faMillionHandler = (price, lan) => {

    if (lan === "fa") {
        const faNumber = Math.floor(price / 1000);
        if (faNumber) {
            const remainder = price % 1000

            return `${faNumber}میلیون و ${remainder} هزار`
        } else {
            return `${price} هزار`
        }
    }
    return price
}