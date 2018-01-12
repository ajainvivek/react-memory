import CryptoJS from 'crypto-js';

/**
 * @private
 * @desc Encode the object to base64 encoded string
 *
 * @returns {String} base64 encoded string
 */
const encode = function(payload, secret) {
    let value = '';
    if (!secret) {
        try {
            value = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        } catch (error) {
            console.warn(error);
        }
    } else {
        try {
            value = CryptoJS.AES.encrypt(JSON.stringify(payload), secret);
        } catch (error) {
            console.warn(error);
        }
    }
    return value;
};

/**
 * @private
 * @desc Retrieves the decoded object
 *
 * @returns {Object} decoded object
 */
const decode = function(cipher, secret) {
    let value = '';

    if (!secret) {
        try {
            value = JSON.parse(decodeURIComponent(escape(atob(cipher))));
        } catch (error) {
            console.warn(error);
        }
    } else {
        try {
            let bytes = CryptoJS.AES.decrypt(cipher.toString(), secret);
            value = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.warn(error);
        }
    }
    return value;
};

export default {
    encode,
    decode,
};
