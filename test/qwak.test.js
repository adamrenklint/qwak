var chai = require('chai');
var expect = chai.expect;
var qwak = require('../lib/qwak');

describe('qwak', function () {

  describe('parse(raw)', function () {

    function testCommand(command, callback) {
      describe('when parsing "' + command + '"', function () {
        var tree = qwak.parse(command);
        callback(tree);
      });
    }

    function assertNote(notes, index, charIndex, position, key, assertions) {
      describe('when parsing "' + key + '" at index ' + charIndex, function () {
        var note = notes[index];
        it('should add the note with correct key: ' + key, function () {
          expect(note.key).to.equal(key);
        });
        it('should add the note at ' + position, function () {
          expect(note.position).to.equal(position);
        });
        it('should assign the note the correct index: ' + charIndex, function () {
          expect(note.index).to.equal(charIndex);
        });
        assertions = assertions || {};
        Object.keys(assertions).forEach(function (key) {
          it('should set "' + key + '" to "' + assertions[key] + '"', function () {
            expect(note[key]).to.equal(assertions[key]);
          });
        });
      });
    }

    function assertBars(tree, expected) {
      it('should set tree.bars to ' + expected, function () {
        expect(tree.bars).to.equal(expected);
      });
    }

    it('should return a context object', function () {
      expect(qwak.parse('/qwak')).to.be.a('object');
    });

    it('should set default tempo to 88 bpm', function () {
      expect(qwak.parse('/qwak').tempo).to.equal(88);
    });

    it('should correctly parse leading tempo command', function () {
      expect(qwak.parse('/90/qwak').tempo).to.equal(90);
    });

    it('should throw error for non-leading tempo command', function () {
      expect(function () {
        qwak.parse('/qwak/90/asd');
      }).to.throw('tempo command only allowed in leading position');
      expect(function () {
        qwak.parse('/56/qwak/90/asd');
      }).to.throw('tempo command only allowed in leading position');
    });

    it('should assume kit=1 when not defined', function () {
      var context = qwak.parse('qwak/asd');
      expect(context.sequences).to.be.a('array');
      expect(context.sequences[0].kit).to.equal(1);
      expect(context.sequences[1].kit).to.equal(1);
    });

    it('should allow explicit definition of kit', function () {
      var context = qwak.parse('/qwak/2=asd');
      expect(context.sequences[0].kit).to.equal(1);
      expect(context.sequences[1].kit).to.equal(2);
    });

    it('should parse "/qwak" into notes', function () {
      var context = qwak.parse('/qwak');
      expect(context.sequences[0].notes[0].key).to.equal('q');
      expect(context.sequences[0].notes[0].position).to.equal('1.1.01');
      expect(context.sequences[0].notes[1].key).to.equal('w');
      expect(context.sequences[0].notes[1].position).to.equal('1.1.49');
      expect(context.sequences[0].notes[2].key).to.equal('a');
      expect(context.sequences[0].notes[2].position).to.equal('1.2.01');
      expect(context.sequences[0].notes[3].key).to.equal('k');
      expect(context.sequences[0].notes[3].position).to.equal('1.2.49');
    });

    testCommand('/qwak', function (tree) {
      var seq = tree.sequences[0];
      assertBars(tree, 1);
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq.notes, 3, 3, '1.2.49', 'k');
    });

    testCommand('/q+wa--k', function (tree) {
      var seq = tree.sequences[0];
      assertBars(tree, 1);
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { pitch: 0 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'w', { pitch: 12 });
      assertNote(seq.notes, 2, 3, '1.2.01', 'a', { pitch: 0 });
      assertNote(seq.notes, 3, 6, '1.2.49', 'k', { pitch: -24});
    });

    testCommand('/qwakiusu', function (tree) {
      var seq = tree.sequences[0];
      assertBars(tree, 1);
    });

    testCommand('/(qw)ak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 1, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.25', 'w');
      assertNote(seq.notes, 2, 4, '1.1.49', 'a');
      assertNote(seq.notes, 3, 5, '1.2.01', 'k');
    });

    testCommand('/QwaKqwaK', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'Q', { duration: 48 });
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq.notes, 3, 3, '1.2.49', 'K', { duration: 48});
      assertNote(seq.notes, 4, 4, '1.3.01', 'q');
      assertNote(seq.notes, 5, 5, '1.3.49', 'w');
      assertNote(seq.notes, 6, 6, '1.4.01', 'a');
      assertNote(seq.notes, 7, 7, '1.4.49', 'K', { duration: 48});
    });

    testCommand('/qW_K', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'W', { duration: 96 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'K', { duration: 48 });
      assertNote(seq.notes, 3, 0, '1.3.01', 'q');
      assertNote(seq.notes, 4, 1, '1.3.49', 'W', { duration: 96 });
      assertNote(seq.notes, 5, 3, '1.4.49', 'K', { duration: 48 });
    });

    testCommand('/qW:K', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'W', { duration: 48 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'K', { duration: 48 });
    });

    testCommand('/E_Q:', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'E', { duration: 96 });
      assertNote(seq.notes, 1, 2, '1.2.01', 'Q', { duration: 48 });
    });

    testCommand('/E:QQ', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'E', { duration: 48 });
      assertNote(seq.notes, 1, 2, '1.2.01', 'Q', { duration: 48 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'Q', { duration: 48 });
    });

    testCommand('/q(_q)syi(_(_q))sy', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.73', 'q');
      assertNote(seq.notes, 2, 5, '1.2.01', 's');
      assertNote(seq.notes, 3, 6, '1.2.49', 'y');
      assertNote(seq.notes, 4, 7, '1.3.01', 'i');
      assertNote(seq.notes, 5, 12, '1.3.85', 'q');
      assertNote(seq.notes, 6, 15, '1.4.01', 's');
      assertNote(seq.notes, 7, 16, '1.4.49', 'y');
    });

    testCommand('/W_:W_:------T_', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'W', { duration: 96 });
      assertNote(seq.notes, 1, 3, '1.2.49', 'W', { duration: 96 });
      assertNote(seq.notes, 2, 12, '1.4.01', 'T', { duration: 96 });
    });

    testCommand('/60/1=qwak/2=', function (tree) {
      it('should parse an empty sequence', function () {
        expect(tree.sequences.length).to.equal(2);
      });
    });

    testCommand('/qwak', function (tree) {
      var seq = tree.sequences[0];
      it('should make half-bars loop twice', function () {
        expect(seq.notes.length).to.equal(8);
      });
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq.notes, 3, 3, '1.2.49', 'k');
      assertNote(seq.notes, 4, 0, '1.3.01', 'q');
      assertNote(seq.notes, 5, 1, '1.3.49', 'w');
      assertNote(seq.notes, 6, 2, '1.4.01', 'a');
      assertNote(seq.notes, 7, 3, '1.4.49', 'k');
    });

    testCommand('/qwaK/kseksk', function (tree) {
      var seq1 = tree.sequences[0];
      it('should not make half-bars loop twice', function () {
        expect(seq1.notes.length).to.equal(4);
      });
      assertNote(seq1.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq1.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq1.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq1.notes, 3, 3, '1.2.49', 'K', { duration: 240 });
      var seq2 = tree.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'k');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'e');
      assertNote(seq2.notes, 3, 3, '1.2.49', 'k');
      assertNote(seq2.notes, 4, 4, '1.3.01', 's');
      assertNote(seq2.notes, 5, 5, '1.3.49', 'k');
    });

    testCommand('/W_:W_:------T_/(qq)__(qq)_(_w_w_w)', function (tree) {
      var seq1 = tree.sequences[0];
      assertNote(seq1.notes, 0, 0, '1.1.01', 'W', { duration: 96 });
      assertNote(seq1.notes, 1, 3, '1.2.49', 'W', { duration: 96 });
      assertNote(seq1.notes, 2, 12, '1.4.01', 'T', { duration: 96 });
    });

    testCommand('/q%w%%e^^s', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.49', 'w', { volume: 75 });
      assertNote(seq.notes, 2, 5, '1.2.01', 'e', { volume: 50 });
      assertNote(seq.notes, 3, 8, '1.2.49', 's', { volume: 150 });
    });

    testCommand('/q{w{e}}}s', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.49', 'w', { pan: -25 });
      assertNote(seq.notes, 2, 4, '1.2.01', 'e', { pan: -25 });
      assertNote(seq.notes, 3, 8, '1.2.49', 's', { pan: 75 });
    });

    testCommand('/qq,s_s.ewak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'q');
      assertNote(seq.notes, 2, 3, '1.2.01', 's');
      assertNote(seq.notes, 3, 5, '1.2.65', 's');
      assertNote(seq.notes, 4, 7, '1.3.01', 'e');
      assertNote(seq.notes, 5, 8, '1.3.49', 'w');
      assertNote(seq.notes, 6, 9, '1.4.01', 'a');
      assertNote(seq.notes, 7, 10, '1.4.49', 'k');
    });

    testCommand('/,qqq.s', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 1, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.33', 'q');
      assertNote(seq.notes, 2, 3, '1.1.65', 'q');
      assertNote(seq.notes, 3, 5, '1.2.01', 's');
    });

    testCommand('/(,qq.)wsw', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 2, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.17', 'q');
      assertNote(seq.notes, 2, 6, '1.1.33', 'w');
      assertNote(seq.notes, 3, 7, '1.1.81', 's');
      assertNote(seq.notes, 4, 8, '1.2.33', 'w');
    });

    testCommand('/qw<ak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 3, '1.1.93', 'a');
      assertNote(seq.notes, 3, 4, '1.2.49', 'k');
    });

    testCommand('/q>>w>ak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.57', 'w');
      assertNote(seq.notes, 2, 5, '1.2.05', 'a');
      assertNote(seq.notes, 3, 6, '1.2.49', 'k');
    });

    testCommand('/q<<W_k', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.41', 'W', { duration: 96+8 });
      assertNote(seq.notes, 2, 5, '1.2.49', 'k');
    });

    testCommand('/Q!_k', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'Q', { duration: 48 });
      assertNote(seq.notes, 1, 1, '1.1.49', 'Q', { duration: 96 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'k');
    });

    testCommand('/q+[w+[ak]s]x', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { pitch: 0 });
      assertNote(seq.notes, 1, 3, '1.1.49', 'w', { pitch: 12 });
      assertNote(seq.notes, 2, 6, '1.2.01', 'a', { pitch: 24 });
      assertNote(seq.notes, 3, 7, '1.2.49', 'k', { pitch: 24 });
      assertNote(seq.notes, 4, 9, '1.3.01', 's', { pitch: 12 });
      assertNote(seq.notes, 5, 11, '1.3.49', 'x', { pitch: 0 });
    });


    testCommand('/qw!kq<w!k', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'w');
      assertNote(seq.notes, 3, 3, '1.2.49', 'k');
      assertNote(seq.notes, 4, 4, '1.3.01', 'q');
      assertNote(seq.notes, 5, 6, '1.3.45', 'w');
      assertNote(seq.notes, 6, 7, '1.3.93', 'w');
      assertNote(seq.notes, 7, 8, '1.4.49', 'k');
    });

    testCommand('/q({w{!)ak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.49', 'w', { pan: -25 });
      assertNote(seq.notes, 2, 5, '1.1.73', 'w', { pan: -50 });
      assertNote(seq.notes, 3, 7, '1.2.01', 'a');
      assertNote(seq.notes, 4, 8, '1.2.49', 'k');
    });

    testCommand('/q???a', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { volume: 100 });
      assertNote(seq.notes, 1, 1, '1.1.49', 'q', { volume: 75 });
      assertNote(seq.notes, 2, 2, '1.2.01', 'q', { volume: 50 });
      assertNote(seq.notes, 3, 3, '1.2.49', 'q', { volume: 25 });
      assertNote(seq.notes, 4, 4, '1.3.01', 'a', { volume: 100 });
    });

    testCommand('/q{?{?}?a', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { volume: 100 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'q', { volume: 75, pan: -25 });
      assertNote(seq.notes, 2, 4, '1.2.01', 'q', { volume: 50, pan: -50 });
      assertNote(seq.notes, 3, 6, '1.2.49', 'q', { volume: 25, pan: -25 });
      assertNote(seq.notes, 4, 7, '1.3.01', 'a', { volume: 100 });
    });

    testCommand('/f+>[o+[o]]ba+-r', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { pitch: 0 });
      assertNote(seq.notes, 1, 4, '1.1.53', 'o', { pitch: 12 });
      assertNote(seq.notes, 2, 7, '1.2.05', 'o', { pitch: 24 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'b', { pitch: 0 });
      assertNote(seq.notes, 4, 11, '1.3.01', 'a', { pitch: 0 });
      assertNote(seq.notes, 5, 14, '1.3.49', 'r', { pitch: 0 });
    });

    testCommand('/q&iwak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.01', 'i');
      assertNote(seq.notes, 2, 3, '1.1.49', 'w');
      assertNote(seq.notes, 3, 4, '1.2.01', 'a');
      assertNote(seq.notes, 4, 5, '1.2.49', 'k');
    });

    testCommand('/q(+&+iw)ak', function (tree) {
      var seq = tree.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 5, '1.1.01', 'i', { pitch: 24 });
      assertNote(seq.notes, 2, 6, '1.1.25', 'w');
      assertNote(seq.notes, 3, 8, '1.1.49', 'a');
      assertNote(seq.notes, 4, 9, '1.2.01', 'k');
    });

    testCommand('/foxobaxa/asd*', function (tree) {
      var seq1 = tree.sequences[0];
      assertNote(seq1.notes, 0, 0, '1.1.01', 'f');
      assertNote(seq1.notes, 1, 1, '1.1.49', 'o');
      assertNote(seq1.notes, 2, 2, '1.2.01', 'x');
      assertNote(seq1.notes, 3, 3, '1.2.49', 'o');
      assertNote(seq1.notes, 4, 4, '1.3.01', 'b');
      assertNote(seq1.notes, 5, 5, '1.3.49', 'a');
      assertNote(seq1.notes, 6, 6, '1.4.01', 'x');
      assertNote(seq1.notes, 7, 7, '1.4.49', 'a');

      var seq2 = tree.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 0, '1.2.49', 'a');
      assertNote(seq2.notes, 4, 1, '1.3.01', 's');
      assertNote(seq2.notes, 5, 2, '1.3.49', 'd');
      assertNote(seq2.notes, 6, 0, '1.4.01', 'a');
      assertNote(seq2.notes, 7, 1, '1.4.49', 's');

      it('should not make the tree longer than the longest loop', function () {
        expect(tree.bars).to.equal(1);
      });
    });

    testCommand('/foxobaxa*/(asd)*', function (tree) {
      var seq1 = tree.sequences[0];
      assertNote(seq1.notes, 0, 0, '1.1.01', 'f');
      assertNote(seq1.notes, 1, 1, '1.1.49', 'o');
      assertNote(seq1.notes, 2, 2, '1.2.01', 'x');
      assertNote(seq1.notes, 3, 3, '1.2.49', 'o');
      assertNote(seq1.notes, 4, 4, '1.3.01', 'b');
      assertNote(seq1.notes, 5, 5, '1.3.49', 'a');
      assertNote(seq1.notes, 6, 6, '1.4.01', 'x');
      assertNote(seq1.notes, 7, 7, '1.4.49', 'a');

      var seq2 = tree.sequences[1];
      assertNote(seq2.notes, 0, 1, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 2, '1.1.25', 's');
      assertNote(seq2.notes, 2, 3, '1.1.49', 'd');
      assertNote(seq2.notes, 3, 1, '1.1.73', 'a');
      assertNote(seq2.notes, 4, 2, '1.2.01', 's');
      assertNote(seq2.notes, 5, 3, '1.2.25', 'd');
      assertNote(seq2.notes, 6, 1, '1.2.49', 'a');
      assertNote(seq2.notes, 7, 2, '1.2.73', 's');
      assertNote(seq2.notes, 8, 3, '1.3.01', 'd');
      assertNote(seq2.notes, 9, 1, '1.3.25', 'a');
      assertNote(seq2.notes, 10, 2, '1.3.49', 's');
      assertNote(seq2.notes, 11, 3, '1.3.73', 'd');
      assertNote(seq2.notes, 12, 1, '1.4.01', 'a');
      assertNote(seq2.notes, 13, 2, '1.4.25', 's');
      assertNote(seq2.notes, 14, 3, '1.4.49', 'd');
      assertNote(seq2.notes, 15, 1, '1.4.73', 'a');

      it('should not make the tree longer than the longest loop', function () {
        expect(tree.bars).to.equal(1);
      });
    });

    testCommand('/foxobaxa/asd*fx', function (tree) {
      var seq2 = tree.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 0, '1.2.49', 'a');
      assertNote(seq2.notes, 4, 1, '1.3.01', 's');
      assertNote(seq2.notes, 5, 2, '1.3.49', 'd');
      assertNote(seq2.notes, 6, 0, '1.4.01', 'a');
      assertNote(seq2.notes, 7, 1, '1.4.49', 's');
    });
  });
});
