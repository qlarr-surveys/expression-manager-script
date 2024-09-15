import isSafeCode from '../src/index';

test('greet function returns correct message', () => {
    expect(isSafeCode(';;;getdaSD dasd',["Q1.value"])).toStrictEqual([]);
});

// test('greet function returns correct message', () => {
//     expect(isSafeCode('Q1.value.toString().length',["Q1.value"])).toStrictEqual([]);
// });

// test('greet function returns correct message', () => {
//     expect(isSafeCode('Q1.value.toString().lengths')).toStrictEqual([]);
// });
