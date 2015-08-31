"use strict";

/*E1*/
// if(true){
//     var a = 1;
//     let b = 2;
// }
// document.write(a+'<br/>');
// document.write(b+'<br/>'); // Uncaught ReferenceError: b is not defined

/*E2*/
// function f1() {
//   var a = 8;
//   let n = 5;
//   if (true) {
//       let n = 10;
//       var a = 20
//   }
//   document.write(n+'<br/>'); // 5
//   document.write(a+'<br/>'); // 20
// }
// f1();

/*Exercises1*/
// let a = 5;
// if (true) {
//     let a = 10;
// }
// document.write(a);

/*E3*/
// var a = [];
// for (var i = 0; i < 10; i++) {
//   a[i] = function () {
//     document.write(i);
//   };
// }
// a[6]();

// var a = [];
// for (let i = 0; i < 10; i++) {
//   a[i] = function () {
//     document.write(i);
//   };
// }
// a[6]();

/*E4*/
// if (true) {
//   const max = 5;
// }
// document.write(max);  //Uncaught ReferenceError: max is not defined

// if (true) {
//   const max = 5;
//   document.write(max);  //5
// }

/*E5*/
// var message = "Hello!";
// let age = 25;

// const message = "Goodbye!";
// const age = 30;//cli:Duplicate declaration "age"

/*E6*/
// const C1 = {};
// C1.a = 1;
// document.write(C1.a); // 1
// C1 = {};  // cli: C1 = {};  // 报错  重新赋值，地址改变

// const C2 = Object.freeze({});
// C2.a = 1;
// document.write(C2.a);//Uncaught TypeError: Can't add property a, object is not extensible

/*Exercises2*/
// if(true){
// 	const a=5;
// 	document.write('a1:'+a);
// }
// document.write('a2:'+a);//Uncaught ReferenceError: a is not defined

/*E7*/
// var a = 5;
// var b = 10;

// function tag(s, v1, v2) {
//   document.write(s[0]+'<br/>');
//   document.write(s[1]+'<br/>');
//   document.write(v1+'<br/>');
//   document.write(v2+'<br/>');

//   return "OK";
// }

// tag`Hello ${ a + b } world ${ a * b}`;
// // "Hello "
// // " world "
// // 15
// // 50
// // "OK"

/*E8*/
// var raw =String('Not a newline: \n');
// document.write(raw === 'Not a newline: \\n');// false

//  let raw = String.raw`Not a newline: \n`;
//  document.write(raw === 'Not a newline: \\n'); // true