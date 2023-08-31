import {test, expect} from 'vitest';

import {simpleFilter} from './simpleFilter';
import { it } from 'node:test';


test('simpleFilter', () => {
    const input = [
        {
            id: 1,
            name: 'Filter 1',
            email: 'x@y.com',
            body: 'This is the first filter'
        },
        {
            id: 2,
            name: 'Filter 2',
            email: 'me2U.COM',
            body: 'This is the second filter'
        }
        ];
    const key = 'email';
    const output = simpleFilter(input, key, "x@y.com");
    expect(output).toStrictEqual([
        {
            id: 1,
            name: 'Filter 1',
            email: 'x@y.com',
            body: 'This is the first filter'
        }   
    ]);
});

