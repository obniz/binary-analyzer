# What is this?

バイナリデータを解析するためのライブラリです。
主に、BLEのバイナリ配列を仕様書をもとに定義を書くと、それに沿ってパースしてくれる用途で使います。

### 使い方



```typescript

const analyzer = new BinaryAnalyzer()
  .addTarget('a', [0, 1], 'UIntBE')  //固定値
  .addTarget('a2', [2, 3], 'UIntLE')  //固定値
  .addTargetByLength('b', 3 , 'Ascii')   // 3byteの文字列が入る
  .addTarget('c', [-1, -1 ], 'RawArray') // -1は何が入るか不明な場合
  .addGroup('d',
    new BinaryAnalyzer()
      .addTarget("sx", [-1, -1], 'UIntLE' , (v)=>v/100 )
      .addTarget("sy", [-1, -1], 'UIntLE' , (v)=>"value:"+v )
  )
  .addGroup('e', (analyzer) =>   //arrow関数で書くことも可能
    analyzer.addTarget("sss", [-1, -1, -1, -1], 'RawArray')
  );

const targetData = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10];
//                   ↑↑↑a↑↑↑↑    ↑↑↑a2↑↑↑    ↑↑↑↑↑↑↑b↑↑↑↑↑↑↑   ↑↑↑↑c↑↑↑    ↑↑d.sx↑↑    ↑↑d.sy↑↑     ↑↑↑↑↑↑↑e.sss↑↑↑↑↑↑↑↑ 
//const targetData = "000102030405060708090a" // hex stringも可能

const isValid = analyzer.validate(targetData);
const data = analyzer.getAllData(targetData);  //validじゃない場合はnullが返ってくる

if (data) {
  console.log(data.a); // number 
  console.log(data.a2); // number 
  console.log(data.b); // string  
  console.log(data.c); // number[] 
  console.log(data.d.sx); // number 
  console.log(data.d.sy); // string 
  console.log(data.e.sss); // number[]
}

```
