/*
This is purely to demo how testing works.
*/
import { test, expect } from 'vitest';

import { sum } from './sum';    
test('sum', () => {
    expect(sum(1, 2)).toBe(3);
});


const addLetter = (letter: string) => (word: string) => word + letter;

test('addLetter', () => {
    it('should add a letter to a word', () => {
        expect(addLetter('s')('word')).toBe('words');
    });
    });


    /** do a merge sort function in javascript */

    const mergeSort = (arr: number[]): number[] => {
        if (arr.length < 2) {
            return arr;
        }
        const middle = Math.floor(arr.length / 2);
        const left = arr.slice(0, middle);
        const right = arr.slice(middle);
        return merge(mergeSort(left), mergeSort(right));
    }

    const merge = (left: number[], right: number[]): number[] => {
        const result = [];
        let indexLeft = 0;
        let indexRight = 0;
        while (indexLeft < left.length && indexRight < right.length) {
            if (left[indexLeft] < right[indexRight]) {
                result.push(left[indexLeft]);
                indexLeft++;
            } else {
                result.push(right[indexRight]);
                indexRight++;
            }
        }
        return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
    }

    test('mergeSort', () => {
        it('should sort an array', () => {
            expect(mergeSort([3, 2, 1])).toEqual([1, 2, 3]);
        });
    }   );
    