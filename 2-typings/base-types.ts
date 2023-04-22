'use strict';

const makeOrdinal = require('./makeOrdinal');
const isFiniteNumber = require('./isFinite');
const isSafeNumber = require('./isSafeNumber');

const enum NumberOrders {
    TEN = 10,
    ONE_HUNDRED = 100,
    ONE_THOUSAND = 1000,
    ONE_MILLION = 1_000_000,
    ONE_BILLION = 1_000_000_000,
    ONE_TRILLION = 1_000_000_000_000,
    ONE_QUADRILLION = 1_000_000_000_000_000,
    MAX = 9_007_199_254_740_992,
}

const LESS_THAN_TWENTY: readonly string[] = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
];

const TENTHS_LESS_THAN_HUNDRED: readonly string[] = [
    'zero',
    'ten',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number: number | string, asOrdinal: boolean): string {
    let words;
    const num = typeof number === 'string' ? parseInt(number, 10) : number;

    if (!isFiniteNumber(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it’s either too large or too small.'
        );
    }
    words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number: number, words?: string[]): string {
    let remainder = 0;
    let word = '';
    let wordsInner = words ? [...words] : [];
    let numberInner = number;

    // We’re done
    if (numberInner === 0) {
        return !wordsInner.length ? 'zero' : wordsInner.join(' ').replace(/,$/, '');
    }

    // If negative, prepend “minus”
    if (numberInner < 0) {
        wordsInner.push('minus');
        numberInner = Math.abs(numberInner);
    }

    if (numberInner < 20) {
        remainder = 0;
        word = LESS_THAN_TWENTY[numberInner];

    } else if (numberInner < NumberOrders.ONE_HUNDRED) {
        remainder = numberInner % NumberOrders.TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(numberInner / NumberOrders.TEN)];
        // In case of remainder, we need to handle it here to be able to add the “-”
        if (remainder) {
            word += `-${LESS_THAN_TWENTY[remainder]}`;
            remainder = 0;
        }

    } else if (numberInner < NumberOrders.ONE_THOUSAND) {
        remainder = numberInner % NumberOrders.ONE_HUNDRED;
        word = `${generateWords(Math.floor(numberInner / NumberOrders.ONE_HUNDRED))} hundred`;

    } else if (numberInner < NumberOrders.ONE_MILLION) {
        remainder = numberInner % NumberOrders.ONE_THOUSAND;
        word = `${generateWords(Math.floor(numberInner / NumberOrders.ONE_THOUSAND))} thousand,`;

    } else if (numberInner < NumberOrders.ONE_BILLION) {
        remainder = numberInner % NumberOrders.ONE_MILLION;
        word = `${generateWords(Math.floor(numberInner / NumberOrders.ONE_MILLION))} million,`;

    } else if (numberInner < NumberOrders.ONE_TRILLION) {
        remainder = numberInner % NumberOrders.ONE_BILLION;
        word = `${generateWords(Math.floor(numberInner / NumberOrders.ONE_BILLION))} billion,`;

    } else if (numberInner < NumberOrders.ONE_QUADRILLION) {
        remainder = numberInner % NumberOrders.ONE_TRILLION;
        word = `${generateWords(Math.floor(numberInner / NumberOrders.ONE_TRILLION))} trillion,`;

    } else if (numberInner <= NumberOrders.MAX) {
        remainder = numberInner % NumberOrders.ONE_QUADRILLION;
        word = `${generateWords(Math.floor(numberInner / NumberOrders.ONE_QUADRILLION))} quadrillion,`;
    }

    wordsInner.push(word);
    return generateWords(remainder, wordsInner);
}

module.exports = toWords;
