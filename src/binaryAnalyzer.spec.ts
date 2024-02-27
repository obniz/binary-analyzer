import assert from 'node:assert';
import test from 'node:test';

import {BinaryAnalyzer} from './binaryAnalyzer'

test('pass', () => {

  const analyzer = new BinaryAnalyzer()
    .addTarget('a', [0, 1], 'UIntBE')  //固定値
    .addTarget('a2', [2, 3], 'UIntLE')  //固定値
    .addTargetByLength('b', 5, 'Ascii')   // 3byteの文字列が入る
    .addTarget('c', [-1, -1], 'RawArray') // -1は何が入るか不明な場合
    .addGroup('d',
      new BinaryAnalyzer()
        .addTarget("sx", [-1, -1], 'UIntLE', (v) => v / 100)
        .addTarget("sy", [-1, -1], 'UIntLE', (v) => "value:" + v)
        .addTarget("sz", [-1, -1], 'UIntLE', (v) => ({v}))
    )
    .addGroup('e', (analyzer) =>   //arrow関数で書くことも可能
      analyzer.addTarget("sss", [-1, -1, -1, -1], 'RawArray')
    );

  const targetData = [
    0x00, 0x01,
    0x02, 0x03,
    0x6f, 0x62, 0x6e, 0x69, 0x7a,
    0x07, 0x08,
    0x09, 0x0a,
    0x0b, 0x0c,
    0x0d, 0x0e,
    0x0f, 0x10, 0x11, 0x12];

  const isValid = analyzer.validate(targetData);
  const data = analyzer.getAllData(targetData);  //validじゃない場合はnullが返ってくる

  assert.equal(isValid, true, "validation failed");
  assert.equal(data !== null, true, "data is null");
  assert.deepEqual(data, {
    a: 0x0001,
    a2: 0x0302,
    b: "obniz",
    c: [0x07, 0x08],
    d: {
      sx: 25.69, //  25.69 = 0x0a09 / 100,
      sy: "value:3083",
      sz: {v: 0x0e0d}
    },
    e: {
      sss: [0x0f, 0x10, 0x11, 0x12]
    }
  })


});


test('invalid', () => {

  const analyzer = new BinaryAnalyzer()
    .addTarget('a', [0, 1], 'UIntBE')

  const targetData = [0x00, 0x02];

  const isValid = analyzer.validate(targetData);
  const data = analyzer.getAllData(targetData);  //validじゃない場合はnullが返ってくる

  assert.equal(isValid, false, "validation failed");
  assert.equal(data !== null, false, "data is null");

});
