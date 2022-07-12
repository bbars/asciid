import * as asciid from '../index.js';

const canvas = new asciid.Canvas(20, 30);

canvas.mov(1, 10).write('0').write(new asciid.gen.LightLine(0)).off(1);
canvas.mov(1, 11).write('1').write(new asciid.gen.LightLine(1)).off(1);
canvas.mov(1, 12).write('2').write(new asciid.gen.LightLine(2)).off(1);
canvas.mov(1, 13).write('3').write(new asciid.gen.LightLine(3)).off(1);
canvas.mov(1, 14).write('4').write(new asciid.gen.LightLine(4)).off(1);
canvas.mov(10, 10).write('0').write(new asciid.gen.HeavyLine(0)).off(1);
canvas.mov(10, 11).write('1').write(new asciid.gen.HeavyLine(1)).off(1);
canvas.mov(10, 12).write('2').write(new asciid.gen.HeavyLine(2)).off(1);
canvas.mov(10, 13).write('3').write(new asciid.gen.HeavyLine(3)).off(1);
canvas.mov(10, 14).write('4').write(new asciid.gen.HeavyLine(4)).off(1);
canvas.mov(1, 15).write('0').write(new asciid.gen.DoubleLine(0)).off(1);
canvas.mov(1, 16).write('1').write(new asciid.gen.DoubleLine(1)).off(1);
canvas.mov(1, 17).write('2').write(new asciid.gen.DoubleLine(2)).off(1);
canvas.mov(1, 18).write('3').write(new asciid.gen.DoubleLine(3)).off(1);
canvas.mov(1, 19).write('4').write(new asciid.gen.DoubleLine(4)).off(1);

canvas.mov(3, 21).setDir(asciid.Dir.RIGHT).write('Multiline\ntext');
canvas.mov(15, 21).setDir(asciid.Dir.DOWN).write('Multiline\ntext');
canvas.mov(11, 25).setDir(asciid.Dir.LEFT).write('Multiline\ntext');
canvas.mov(3, 28).setDir(asciid.Dir.RIGHT).write('Text\rwith\rreturn\rchar');

const clRed = new asciid.mod.Span('cl-red');
const invert = new asciid.mod.Span('invert');

canvas.mov(0, 0).write(new asciid.gen.LightRect(20, 10, true));
canvas.mov(6, 3).write(new asciid.gen.DoubleRect(7, 3).pipe(clRed));
canvas.mov(5, 2).write(new asciid.gen.HeavyRect(9, 5));

canvas.mov(7, 4).setDir(asciid.Dir.RIGHT).write('Hello');
canvas.mov(7, 7).setDir(asciid.Dir.LEFT).write('Hello');
canvas.off(1, 1).setDir(asciid.Dir.RIGHT).write(invert.feed('Aloha').feed('!'));
canvas.setDir(asciid.Dir.RIGHT);

canvas.setDir(asciid.Dir.DOWN);
canvas.mov(11, 5).write(new asciid.gen.LightLine(4).pipe(new asciid.mod.BeautyLines()));
canvas.setDir(asciid.Dir.RIGHT);

process.stdout.write(canvas.toString());
