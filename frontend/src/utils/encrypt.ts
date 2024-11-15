import CryptoJS from "crypto-js";

const secretPass = process.env.REACT_APP_SECRET;

export const encryptJSON = (value: object) => {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        secretPass
      ).toString();

    return JSON.stringify({message: data});
}

export const decryptJSON = (value: string) => {
    const json = JSON.parse(value);
    const bytes = CryptoJS.AES.decrypt(json.message, secretPass);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return data;
}