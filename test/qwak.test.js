var chai = require('chai');
var expect = chai.expect;
var qwak = require('../lib/qwak');

describe('qwak', function () {

  describe('parse(raw)', function () {

    function testCommand(command, callback) {
      describe('when parsing "' + command + '"', function () {
        callback(qwak.parse(command));
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

    function assertBars(pattern, expected) {
      it('should set pattern.bars to ' + expected, function () {
        expect(pattern.bars).to.equal(expected);
      });
    }

    it('should return a pattern object', function () {
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
      var pattern = qwak.parse('qwak/asd');
      expect(pattern.sequences).to.be.a('array');
      expect(pattern.sequences[0].kit).to.equal(1);
      expect(pattern.sequences[1].kit).to.equal(1);
    });

    it('should allow explicit definition of kit', function () {
      var pattern = qwak.parse('/qwak/2=asd');
      expect(pattern.sequences[0].kit).to.equal(1);
      expect(pattern.sequences[1].kit).to.equal(2);
    });

    it('should parse "/qwak" into notes', function () {
      var pattern = qwak.parse('/qwak');
      expect(pattern.sequences[0].notes[0].key).to.equal('q');
      expect(pattern.sequences[0].notes[0].position).to.equal('1.1.01');
      expect(pattern.sequences[0].notes[1].key).to.equal('w');
      expect(pattern.sequences[0].notes[1].position).to.equal('1.1.49');
      expect(pattern.sequences[0].notes[2].key).to.equal('a');
      expect(pattern.sequences[0].notes[2].position).to.equal('1.2.01');
      expect(pattern.sequences[0].notes[3].key).to.equal('k');
      expect(pattern.sequences[0].notes[3].position).to.equal('1.2.49');
    });

    testCommand('/qwak', function (pattern) {
      var seq = pattern.sequences[0];
      assertBars(pattern, 1);
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq.notes, 3, 3, '1.2.49', 'k');
    });

    testCommand('/q+wa--k', function (pattern) {
      var seq = pattern.sequences[0];
      assertBars(pattern, 1);
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { pitch: 0 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'w', { pitch: 12 });
      assertNote(seq.notes, 2, 3, '1.2.01', 'a', { pitch: 0 });
      assertNote(seq.notes, 3, 6, '1.2.49', 'k', { pitch: -24});
    });

    testCommand('/qwakiusu', function (pattern) {
      var seq = pattern.sequences[0];
      assertBars(pattern, 1);
    });

    testCommand('/(qw)ak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 1, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.25', 'w');
      assertNote(seq.notes, 2, 4, '1.1.49', 'a');
      assertNote(seq.notes, 3, 5, '1.2.01', 'k');
    });

    testCommand('/QwaKqwaK', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'Q', { duration: 48 });
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq.notes, 3, 3, '1.2.49', 'K', { duration: 48});
      assertNote(seq.notes, 4, 4, '1.3.01', 'q');
      assertNote(seq.notes, 5, 5, '1.3.49', 'w');
      assertNote(seq.notes, 6, 6, '1.4.01', 'a');
      assertNote(seq.notes, 7, 7, '1.4.49', 'K', { duration: 48});
    });

    testCommand('/qW_K', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'W', { duration: 96 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'K', { duration: 48 });
      assertNote(seq.notes, 3, 0, '1.3.01', 'q');
      assertNote(seq.notes, 4, 1, '1.3.49', 'W', { duration: 96 });
      assertNote(seq.notes, 5, 3, '1.4.49', 'K', { duration: 48 });
    });

    testCommand('/qW:K', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'W', { duration: 48 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'K', { duration: 48 });
    });

    testCommand('/E_Q:', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'E', { duration: 96 });
      assertNote(seq.notes, 1, 2, '1.2.01', 'Q', { duration: 48 });
    });

    testCommand('/E:QQ', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'E', { duration: 48 });
      assertNote(seq.notes, 1, 2, '1.2.01', 'Q', { duration: 48 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'Q', { duration: 48 });
    });

    testCommand('/q(_q)syi(_(_q))sy', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.73', 'q');
      assertNote(seq.notes, 2, 5, '1.2.01', 's');
      assertNote(seq.notes, 3, 6, '1.2.49', 'y');
      assertNote(seq.notes, 4, 7, '1.3.01', 'i');
      assertNote(seq.notes, 5, 12, '1.3.85', 'q');
      assertNote(seq.notes, 6, 15, '1.4.01', 's');
      assertNote(seq.notes, 7, 16, '1.4.49', 'y');
    });

    testCommand('/W_:W_:------T_', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'W', { duration: 96 });
      assertNote(seq.notes, 1, 3, '1.2.49', 'W', { duration: 96 });
      assertNote(seq.notes, 2, 12, '1.4.01', 'T', { duration: 96 });
    });

    testCommand('/60/1=qwak/2=', function (pattern) {
      it('should parse an empty sequence', function () {
        expect(pattern.sequences.length).to.equal(2);
      });
    });

    testCommand('/qwak', function (pattern) {
      var seq = pattern.sequences[0];
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

    testCommand('/qwaK/kseksk', function (pattern) {
      var seq1 = pattern.sequences[0];
      it('should not make half-bars loop twice', function () {
        expect(seq1.notes.length).to.equal(4);
      });
      assertNote(seq1.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq1.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq1.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq1.notes, 3, 3, '1.2.49', 'K', { duration: 240 });
      var seq2 = pattern.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'k');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'e');
      assertNote(seq2.notes, 3, 3, '1.2.49', 'k');
      assertNote(seq2.notes, 4, 4, '1.3.01', 's');
      assertNote(seq2.notes, 5, 5, '1.3.49', 'k');
    });

    testCommand('/W_:W_:------T_/(qq)__(qq)_(_w_w_w)', function (pattern) {
      var seq1 = pattern.sequences[0];
      assertNote(seq1.notes, 0, 0, '1.1.01', 'W', { duration: 96 });
      assertNote(seq1.notes, 1, 3, '1.2.49', 'W', { duration: 96 });
      assertNote(seq1.notes, 2, 12, '1.4.01', 'T', { duration: 96 });
    });

    testCommand('/q%w%%e^^s', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.49', 'w', { volume: 80 });
      assertNote(seq.notes, 2, 5, '1.2.01', 'e', { volume: 60 });
      assertNote(seq.notes, 3, 8, '1.2.49', 's', { volume: 140 });
    });

    testCommand('/q{w{e}}}s', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.49', 'w', { pan: -25 });
      assertNote(seq.notes, 2, 4, '1.2.01', 'e', { pan: -25 });
      assertNote(seq.notes, 3, 8, '1.2.49', 's', { pan: 75 });
    });

    testCommand('/qq,s_s.ewak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'q');
      assertNote(seq.notes, 2, 3, '1.2.01', 's');
      assertNote(seq.notes, 3, 5, '1.2.65', 's');
      assertNote(seq.notes, 4, 7, '1.3.01', 'e');
      assertNote(seq.notes, 5, 8, '1.3.49', 'w');
      assertNote(seq.notes, 6, 9, '1.4.01', 'a');
      assertNote(seq.notes, 7, 10, '1.4.49', 'k');
    });

    testCommand('/,qqq.s', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 1, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.33', 'q');
      assertNote(seq.notes, 2, 3, '1.1.65', 'q');
      assertNote(seq.notes, 3, 5, '1.2.01', 's');
    });

    testCommand('/(,qq.)wsw', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 2, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.17', 'q');
      assertNote(seq.notes, 2, 6, '1.1.33', 'w');
      assertNote(seq.notes, 3, 7, '1.1.81', 's');
      assertNote(seq.notes, 4, 8, '1.2.33', 'w');
    });

    testCommand('/qw<ak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 3, '1.1.93', 'a');
      assertNote(seq.notes, 3, 4, '1.2.49', 'k');
    });

    testCommand('/q>>w>ak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.57', 'w');
      assertNote(seq.notes, 2, 5, '1.2.05', 'a');
      assertNote(seq.notes, 3, 6, '1.2.49', 'k');
    });

    testCommand('/q<<W_k', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.41', 'W', { duration: 96+8 });
      assertNote(seq.notes, 2, 5, '1.2.49', 'k');
    });

    testCommand('/Q!_k', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'Q', { duration: 48 });
      assertNote(seq.notes, 1, 1, '1.1.49', 'Q', { duration: 96 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'k');
    });

    testCommand('/q+[w+[ak]s]x', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { pitch: 0 });
      assertNote(seq.notes, 1, 3, '1.1.49', 'w', { pitch: 12 });
      assertNote(seq.notes, 2, 6, '1.2.01', 'a', { pitch: 24 });
      assertNote(seq.notes, 3, 7, '1.2.49', 'k', { pitch: 24 });
      assertNote(seq.notes, 4, 9, '1.3.01', 's', { pitch: 12 });
      assertNote(seq.notes, 5, 11, '1.3.49', 'x', { pitch: 0 });
    });


    testCommand('/qw!kq<w!k', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'w');
      assertNote(seq.notes, 3, 3, '1.2.49', 'k');
      assertNote(seq.notes, 4, 4, '1.3.01', 'q');
      assertNote(seq.notes, 5, 6, '1.3.45', 'w');
      assertNote(seq.notes, 6, 7, '1.3.93', 'w');
      assertNote(seq.notes, 7, 8, '1.4.49', 'k');
    });

    testCommand('/q({w{!)ak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 3, '1.1.49', 'w', { pan: -25 });
      assertNote(seq.notes, 2, 5, '1.1.73', 'w', { pan: -50 });
      assertNote(seq.notes, 3, 7, '1.2.01', 'a');
      assertNote(seq.notes, 4, 8, '1.2.49', 'k');
    });

    testCommand('/q???a', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { volume: 100 });
      assertNote(seq.notes, 1, 1, '1.1.49', 'q', { volume: 80 });
      assertNote(seq.notes, 2, 2, '1.2.01', 'q', { volume: 60 });
      assertNote(seq.notes, 3, 3, '1.2.49', 'q', { volume: 40 });
      assertNote(seq.notes, 4, 4, '1.3.01', 'a', { volume: 100 });
    });

    testCommand('/q{?{?}?a', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { volume: 100 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'q', { volume: 80, pan: -25 });
      assertNote(seq.notes, 2, 4, '1.2.01', 'q', { volume: 60, pan: -50 });
      assertNote(seq.notes, 3, 6, '1.2.49', 'q', { volume: 40, pan: -25 });
      assertNote(seq.notes, 4, 7, '1.3.01', 'a', { volume: 100 });
    });

    testCommand('/f+>[o+[o]]ba+-r', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { pitch: 0 });
      assertNote(seq.notes, 1, 4, '1.1.53', 'o', { pitch: 12 });
      assertNote(seq.notes, 2, 7, '1.2.05', 'o', { pitch: 24 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'b', { pitch: 0 });
      assertNote(seq.notes, 4, 11, '1.3.01', 'a', { pitch: 0 });
      assertNote(seq.notes, 5, 14, '1.3.49', 'r', { pitch: 0 });
    });

    testCommand('/q&iwak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 2, '1.1.01', 'i');
      assertNote(seq.notes, 2, 3, '1.1.49', 'w');
      assertNote(seq.notes, 3, 4, '1.2.01', 'a');
      assertNote(seq.notes, 4, 5, '1.2.49', 'k');
    });

    testCommand('/q(+&+iw)ak', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 5, '1.1.01', 'i', { pitch: 24 });
      assertNote(seq.notes, 2, 6, '1.1.25', 'w');
      assertNote(seq.notes, 3, 8, '1.1.49', 'a');
      assertNote(seq.notes, 4, 9, '1.2.01', 'k');
    });

    testCommand('/foxobaxa/asd*', function (pattern) {
      var seq1 = pattern.sequences[0];
      assertNote(seq1.notes, 0, 0, '1.1.01', 'f');
      assertNote(seq1.notes, 1, 1, '1.1.49', 'o');
      assertNote(seq1.notes, 2, 2, '1.2.01', 'x');
      assertNote(seq1.notes, 3, 3, '1.2.49', 'o');
      assertNote(seq1.notes, 4, 4, '1.3.01', 'b');
      assertNote(seq1.notes, 5, 5, '1.3.49', 'a');
      assertNote(seq1.notes, 6, 6, '1.4.01', 'x');
      assertNote(seq1.notes, 7, 7, '1.4.49', 'a');

      var seq2 = pattern.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 0, '1.2.49', 'a');
      assertNote(seq2.notes, 4, 1, '1.3.01', 's');
      assertNote(seq2.notes, 5, 2, '1.3.49', 'd');
      assertNote(seq2.notes, 6, 0, '1.4.01', 'a');
      assertNote(seq2.notes, 7, 1, '1.4.49', 's');

      it('should not make the pattern longer than the longest loop', function () {
        expect(pattern.bars).to.equal(1);
      });
    });

    testCommand('/foxobaxa*/(asd)*', function (pattern) {
      var seq1 = pattern.sequences[0];
      assertNote(seq1.notes, 0, 0, '1.1.01', 'f');
      assertNote(seq1.notes, 1, 1, '1.1.49', 'o');
      assertNote(seq1.notes, 2, 2, '1.2.01', 'x');
      assertNote(seq1.notes, 3, 3, '1.2.49', 'o');
      assertNote(seq1.notes, 4, 4, '1.3.01', 'b');
      assertNote(seq1.notes, 5, 5, '1.3.49', 'a');
      assertNote(seq1.notes, 6, 6, '1.4.01', 'x');
      assertNote(seq1.notes, 7, 7, '1.4.49', 'a');

      var seq2 = pattern.sequences[1];
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

      it('should not make the pattern longer than the longest loop', function () {
        expect(pattern.bars).to.equal(1);
      });
    });

    testCommand('/foxobaxa/asd*fx', function (pattern) {
      var seq2 = pattern.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 0, '1.2.49', 'a');
      assertNote(seq2.notes, 4, 1, '1.3.01', 's');
      assertNote(seq2.notes, 5, 2, '1.3.49', 'd');
      assertNote(seq2.notes, 6, 0, '1.4.01', 'a');
      assertNote(seq2.notes, 7, 1, '1.4.49', 's');
    });

    testCommand('/foxobaxa/asd;', function (pattern) {
      var seq2 = pattern.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 0, '1.3.01', 'a');
      assertNote(seq2.notes, 4, 1, '1.3.49', 's');
      assertNote(seq2.notes, 5, 2, '1.4.01', 'd');
    });

    testCommand('/foxobaxa/asdf;', function (pattern) {
      var seq2 = pattern.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 3, '1.2.49', 'f');
      assertNote(seq2.notes, 4, 0, '1.3.01', 'a');
      assertNote(seq2.notes, 5, 1, '1.3.49', 's');
      assertNote(seq2.notes, 6, 2, '1.4.01', 'd');
      assertNote(seq2.notes, 7, 3, '1.4.49', 'f');
    });

    testCommand('/foxobaxafoxobaxa/asdfgh;', function (pattern) {
      var seq2 = pattern.sequences[1];
      assertNote(seq2.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq2.notes, 1, 1, '1.1.49', 's');
      assertNote(seq2.notes, 2, 2, '1.2.01', 'd');
      assertNote(seq2.notes, 3, 3, '1.2.49', 'f');
      assertNote(seq2.notes, 4, 4, '1.3.01', 'g');
      assertNote(seq2.notes, 5, 5, '1.3.49', 'h');
      assertNote(seq2.notes, 6, 0, '2.1.01', 'a');
      assertNote(seq2.notes, 7, 1, '2.1.49', 's');
      assertNote(seq2.notes, 8, 2, '2.2.01', 'd');
      assertNote(seq2.notes, 9, 3, '2.2.49', 'f');
      assertNote(seq2.notes, 10, 4, '2.3.01', 'g');
      assertNote(seq2.notes, 11, 5, '2.3.49', 'h');
    });

    testCommand('/_--[ER_:_W?]', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 4, '1.1.49', 'E', { duration: 48, pitch: -24 });
      assertNote(seq.notes, 1, 5, '1.2.01', 'R', { duration: 96, pitch: -24 });
      assertNote(seq.notes, 2, 9, '1.4.01', 'W', { duration: 48, pitch: -24 });
      assertNote(seq.notes, 3, 10, '1.4.49', 'W', { duration: 48, pitch: -24 });
    });

    testCommand('/qwaww(qq)se/W_:*', function (pattern) {
      it('should repeat the notes', function () {
        expect(pattern.sequences[1].notes.length).to.equal(3);
      });
    });

    testCommand('/qwakqwakqwakqwakqwakqwakqwakqwak', function (pattern) {
      var seq = pattern.sequences[0];

      it('should have the correct length (sequence.bars)', function () {
        expect(seq.bars).to.equal(4);
      });

      assertNote(seq.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq.notes, 1, 1, '1.1.49', 'w');
      assertNote(seq.notes, 2, 2, '1.2.01', 'a');
      assertNote(seq.notes, 3, 3, '1.2.49', 'k');
      assertNote(seq.notes, 4, 4, '1.3.01', 'q');
      assertNote(seq.notes, 5, 5, '1.3.49', 'w');
      assertNote(seq.notes, 6, 6, '1.4.01', 'a');
      assertNote(seq.notes, 7, 7, '1.4.49', 'k');

      assertNote(seq.notes, 8, 8, '2.1.01', 'q');
      assertNote(seq.notes, 9, 9, '2.1.49', 'w');
      assertNote(seq.notes, 10, 10, '2.2.01', 'a');
      assertNote(seq.notes, 11, 11, '2.2.49', 'k');
      assertNote(seq.notes, 12, 12, '2.3.01', 'q');
      assertNote(seq.notes, 13, 13, '2.3.49', 'w');
      assertNote(seq.notes, 14, 14, '2.4.01', 'a');
      assertNote(seq.notes, 15, 15, '2.4.49', 'k');

      assertNote(seq.notes, 16, 16, '3.1.01', 'q');
      assertNote(seq.notes, 17, 17, '3.1.49', 'w');
      assertNote(seq.notes, 18, 18, '3.2.01', 'a');
      assertNote(seq.notes, 19, 19, '3.2.49', 'k');
      assertNote(seq.notes, 20, 20, '3.3.01', 'q');
      assertNote(seq.notes, 21, 21, '3.3.49', 'w');
      assertNote(seq.notes, 22, 22, '3.4.01', 'a');
      assertNote(seq.notes, 23, 23, '3.4.49', 'k');

      assertNote(seq.notes, 24, 24, '4.1.01', 'q');
      assertNote(seq.notes, 25, 25, '4.1.49', 'w');
      assertNote(seq.notes, 26, 26, '4.2.01', 'a');
      assertNote(seq.notes, 27, 27, '4.2.49', 'k');
      assertNote(seq.notes, 28, 28, '4.3.01', 'q');
      assertNote(seq.notes, 29, 29, '4.3.49', 'w');
      assertNote(seq.notes, 30, 30, '4.4.01', 'a');
      assertNote(seq.notes, 31, 31, '4.4.49', 'k');
    });

    describe('/%%_*', function () {
      it('should not throw an error', function () {
        expect(function () {
          qwak.parse('/%%_*');
        }).to.not.throw(Error);
      });
    });

    testCommand('/q_<s_*/i>ii>ii>ii>i', function (pattern) {
      var seq1 = pattern.sequences[0];
      it('should have set correct sequence length', function () {
        expect(seq1.bars).to.equal(0.5);
      });
      assertNote(seq1.notes, 0, 0, '1.1.01', 'q');
      assertNote(seq1.notes, 1, 3, '1.1.93', 's');
      assertNote(seq1.notes, 2, 0, '1.3.01', 'q');
      assertNote(seq1.notes, 3, 3, '1.3.93', 's');

      var seq2 = pattern.sequences[1];
      it('should have set correct sequence length', function () {
        expect(seq2.bars).to.equal(1);
      });
    });

    testCommand('/_R??', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 1, '1.1.49', 'R', { duration: 48 });
      assertNote(seq.notes, 1, 2, '1.2.01', 'R', { duration: 48 });
      assertNote(seq.notes, 2, 3, '1.2.49', 'R', { duration: 48 });
      assertNote(seq.notes, 3, 1, '1.3.49', 'R', { duration: 48 });
      assertNote(seq.notes, 4, 2, '1.4.01', 'R', { duration: 48 });
      assertNote(seq.notes, 5, 3, '1.4.49', 'R', { duration: 48 });
    });

    testCommand('/a~bcd', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { shift: 0 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'b', { shift: 0.1 });
      assertNote(seq.notes, 2, 3, '1.2.01', 'c', { shift: 0 });
      assertNote(seq.notes, 3, 4, '1.2.49', 'd', { shift: 0 });
    });

    testCommand('/a~100bc~~d', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { shift: 0 });
      assertNote(seq.notes, 1, 5, '1.1.49', 'b', { shift: 0.1 });
      assertNote(seq.notes, 2, 6, '1.2.01', 'c', { shift: 0 });
      assertNote(seq.notes, 3, 9, '1.2.49', 'd', { shift: 0.2 });
    });

    testCommand('/a~1000bcd', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { shift: 0 });
      assertNote(seq.notes, 1, 6, '1.1.49', 'b', { shift: 1 });
      assertNote(seq.notes, 2, 7, '1.2.01', 'c', { shift: 0 });
      assertNote(seq.notes, 3, 8, '1.2.49', 'd', { shift: 0 });
    });

    testCommand('/a~1000[b~[cd]]e', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { shift: 0 });
      assertNote(seq.notes, 1, 7, '1.1.49', 'b', { shift: 1 });
      assertNote(seq.notes, 2, 10, '1.2.01', 'c', { shift: 1.1 });
      assertNote(seq.notes, 3, 11, '1.2.49', 'd', { shift: 1.1 });
      assertNote(seq.notes, 4, 14, '1.3.01', 'e', { shift: 0 });
    });

    testCommand('/a+43bc-21[de-[fg]]h', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { pitch: 0 });
      assertNote(seq.notes, 1, 4, '1.1.49', 'b', { pitch: 43 });
      assertNote(seq.notes, 2, 5, '1.2.01', 'c', { pitch: 0 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'd', { pitch: -21 });
      assertNote(seq.notes, 4, 11, '1.3.01', 'e', { pitch: -21 });
      assertNote(seq.notes, 5, 14, '1.3.49', 'f', { pitch: -33 });
      assertNote(seq.notes, 6, 15, '1.4.01', 'g', { pitch: -33 });
      assertNote(seq.notes, 7, 18, '1.4.49', 'h', { pitch: 0 });
    });

    testCommand('/a^43bc%21[de%[fg]]h', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { volume: 100 });
      assertNote(seq.notes, 1, 4, '1.1.49', 'b', { volume: 143 });
      assertNote(seq.notes, 2, 5, '1.2.01', 'c', { volume: 100 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'd', { volume: 79 });
      assertNote(seq.notes, 4, 11, '1.3.01', 'e', { volume: 79 });
      assertNote(seq.notes, 5, 14, '1.3.49', 'f', { volume: 59 });
      assertNote(seq.notes, 6, 15, '1.4.01', 'g', { volume: 59 });
      assertNote(seq.notes, 7, 18, '1.4.49', 'h', { volume: 100 });
    });

    testCommand('/a{43bc}21[de}[fg]]h', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a', { pan: 0 });
      assertNote(seq.notes, 1, 4, '1.1.49', 'b', { pan: -43 });
      assertNote(seq.notes, 2, 5, '1.2.01', 'c', { pan: 0 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'd', { pan: 21 });
      assertNote(seq.notes, 4, 11, '1.3.01', 'e', { pan: 21 });
      assertNote(seq.notes, 5, 14, '1.3.49', 'f', { pan: 46 });
      assertNote(seq.notes, 6, 15, '1.4.01', 'g', { pan: 46 });
      assertNote(seq.notes, 7, 18, '1.4.49', 'h', { pan: 0 });
    });

    testCommand('/a<10bc(>10)[de>[fg]]h', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 4, '1.1.39', 'b');
      assertNote(seq.notes, 2, 5, '1.2.01', 'c');
      assertNote(seq.notes, 3, 12, '1.2.59', 'd');
      assertNote(seq.notes, 4, 13, '1.3.11', 'e');
      assertNote(seq.notes, 5, 16, '1.3.63', 'f');
      assertNote(seq.notes, 6, 17, '1.4.15', 'g');
      assertNote(seq.notes, 7, 20, '1.4.49', 'h');
    });

    testCommand("/a'bcd", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 2, '1.1.49', 'b', { attack: 0.1 });
      assertNote(seq.notes, 2, 3, '1.2.01', 'c');
      assertNote(seq.notes, 3, 4, '1.2.49', 'd');
    });

    testCommand("/a'250bcd", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 5, '1.1.49', 'b', { attack: 0.25 });
      assertNote(seq.notes, 2, 6, '1.2.01', 'c');
      assertNote(seq.notes, 3, 7, '1.2.49', 'd');
    });

    testCommand("/a'250[b'c]d", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 6, '1.1.49', 'b', { attack: 0.25 });
      assertNote(seq.notes, 2, 8, '1.2.01', 'c', { attack: 0.35 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'd');
    });

    testCommand("/a`bcd", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 2, '1.1.49', 'b', { release: 0.1 });
      assertNote(seq.notes, 2, 3, '1.2.01', 'c');
      assertNote(seq.notes, 3, 4, '1.2.49', 'd');
    });

    testCommand("/a`250bcd", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 5, '1.1.49', 'b', { release: 0.25 });
      assertNote(seq.notes, 2, 6, '1.2.01', 'c');
      assertNote(seq.notes, 3, 7, '1.2.49', 'd');
    });

    testCommand("/a`250[b`c]d", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'a');
      assertNote(seq.notes, 1, 6, '1.1.49', 'b', { release: 0.25 });
      assertNote(seq.notes, 2, 8, '1.2.01', 'c', { release: 0.35 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'd');
    });

    testCommand('/≈ab≈[cd≈e]f', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 1, '1.1.01', 'a', { reverse: true });
      assertNote(seq.notes, 1, 2, '1.1.49', 'b', { reverse: false });
      assertNote(seq.notes, 2, 5, '1.2.01', 'c', { reverse: true });
      assertNote(seq.notes, 3, 6, '1.2.49', 'd', { reverse: true });
      assertNote(seq.notes, 4, 8, '1.3.01', 'e', { reverse: false });
      assertNote(seq.notes, 5, 10, '1.3.49', 'f', { reverse: false });
    });

    testCommand('/W_*/qiai', function (pattern) {
      var seq = pattern.sequences[0];
      it('should be the correct length', function () {
        expect(seq.notes.length).to.equal(4);
      });
      assertNote(seq.notes, 0, 0, '1.1.01', 'W', { duration: 96 });
      assertNote(seq.notes, 1, 0, '1.2.01', 'W', { duration: 96 });
      assertNote(seq.notes, 2, 0, '1.3.01', 'W', { duration: 96 });
      assertNote(seq.notes, 3, 0, '1.4.01', 'W', { duration: 96 });
    });

    testCommand('/W_*', function (pattern) {
      var seq = pattern.sequences[0];
      it('should be the correct length', function () {
        expect(seq.notes.length).to.equal(4);
      });
      assertNote(seq.notes, 0, 0, '1.1.01', 'W', { duration: 96 });
      assertNote(seq.notes, 1, 0, '1.2.01', 'W', { duration: 96 });
      assertNote(seq.notes, 2, 0, '1.3.01', 'W', { duration: 96 });
      assertNote(seq.notes, 3, 0, '1.4.01', 'W', { duration: 96 });
    });

    testCommand("/80/q_<a_q(_>q)<a_q_<a(_>q)q>q&%%%%ha_", function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 9, 25, '2.3.53', 'q', { size: 0.9166666666666666 });
      assertNote(seq.notes, 10, 31, '2.3.53', 'h', { size: 0.9166666666666666 });
      assertNote(seq.notes, 11, 32, '2.4.01', 'a', { size: 1 });
    });

    testCommand('/56/3=_Q_E/1=,i%%i%iO%%i%ii(%%I%O)%iO%%i%i*/1=(,W__W_%%%WA___%%%W%%WW__A_WA___*/4=', function (pattern) {
      var seq = pattern.sequences[2];
      it('should be the correct length', function () {
        expect(pattern.bars).to.equal(1);
      });
      it('should create the correct amount of notes', function () {
        expect(seq.notes.length).to.equal(11);
      });
      assertNote(seq.notes, 0, 2, '1.1.01', 'W', { duration: 48 });
      assertNote(seq.notes, 1, 5, '1.1.49', 'W', { duration: 32 });
      assertNote(seq.notes, 2, 10, '1.1.81', 'W', { duration: 16, volume: 40 });
      assertNote(seq.notes, 3, 11, '1.2.01', 'A', { duration: 64 });
      assertNote(seq.notes, 4, 18, '1.2.65', 'W', { duration: 16, volume: 40 });
      assertNote(seq.notes, 5, 21, '1.2.81', 'W', { duration: 16, volume: 60 });
      assertNote(seq.notes, 6, 22, '1.3.01', 'W', { duration: 48 });
      assertNote(seq.notes, 7, 25, '1.3.49', 'A', { duration: 32 });
      assertNote(seq.notes, 8, 27, '1.3.81', 'W', { duration: 16 });
      assertNote(seq.notes, 9, 28, '1.4.01', 'A', { duration: 64 });
      assertNote(seq.notes, 10, 2, '1.4.65', 'W', { duration: 32 });
    });

    testCommand('/Q&S', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'Q', { duration: 192 });
      assertNote(seq.notes, 1, 2, '1.1.01', 'S', { duration: 192 });
      assertNote(seq.notes, 2, 0, '1.3.01', 'Q', { duration: 192 });
      assertNote(seq.notes, 3, 2, '1.3.01', 'S', { duration: 192 });
    });

    testCommand('/,Q&S_*', function (pattern) {
      var seq = pattern.sequences[0];
      it('should be the correct length', function () {
        expect(pattern.bars).to.equal(1);
      });
      it('should create the correct amount of notes', function () {
        expect(seq.notes.length).to.equal(12);
      });
      assertNote(seq.notes, 0, 1, '1.1.01', 'Q', { duration: 64 });
      assertNote(seq.notes, 1, 3, '1.1.01', 'S', { duration: 64 });
      assertNote(seq.notes, 2, 1, '1.1.65', 'Q', { duration: 64 });
      assertNote(seq.notes, 3, 3, '1.1.65', 'S', { duration: 64 });
      assertNote(seq.notes, 4, 1, '1.2.33', 'Q', { duration: 64 });
      assertNote(seq.notes, 5, 3, '1.2.33', 'S', { duration: 64 });
      assertNote(seq.notes, 6, 1, '1.3.01', 'Q', { duration: 64 });
      assertNote(seq.notes, 7, 3, '1.3.01', 'S', { duration: 64 });
      assertNote(seq.notes, 8, 1, '1.3.65', 'Q', { duration: 64 });
      assertNote(seq.notes, 9, 3, '1.3.65', 'S', { duration: 64 });
      assertNote(seq.notes, 10, 1, '1.4.33', 'Q', { duration: 64 });
      assertNote(seq.notes, 11, 3, '1.4.33', 'S', { duration: 64 });
    });

    testCommand('/q§500sad', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { oneshot: true });
      assertNote(seq.notes, 1, 5, '1.1.49', 's', { oneshot: false, maxlength: 0.5 });
      assertNote(seq.notes, 2, 6, '1.2.01', 'a', { oneshot: true });
      assertNote(seq.notes, 3, 7, '1.2.49', 'd', { oneshot: true });
    });

    testCommand('/q§500[sa]d', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { oneshot: true });
      assertNote(seq.notes, 1, 6, '1.1.49', 's', { oneshot: false, maxlength: 0.5 });
      assertNote(seq.notes, 2, 7, '1.2.01', 'a', { oneshot: false, maxlength: 0.5 });
      assertNote(seq.notes, 3, 9, '1.2.49', 'd', { oneshot: true });
    });

    testCommand('/q§500[s§250a]d', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { oneshot: true });
      assertNote(seq.notes, 1, 6, '1.1.49', 's', { oneshot: false, maxlength: 0.5 });
      assertNote(seq.notes, 2, 11, '1.2.01', 'a', { oneshot: false, maxlength: 0.25 });
      assertNote(seq.notes, 3, 13, '1.2.49', 'd', { oneshot: true });
    });

    testCommand('/q§1000SAd', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { oneshot: true });
      assertNote(seq.notes, 1, 6, '1.1.49', 'S', { oneshot: false, maxlength: 1, duration: 0 });
      assertNote(seq.notes, 2, 7, '1.2.01', 'A', { oneshot: false, duration: 48 });
      assertNote(seq.notes, 3, 8, '1.2.49', 'd', { oneshot: true });
    });

    testCommand('/q∞asd', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { loop: 0 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'a', { loop: 0.1 });
      assertNote(seq.notes, 2, 3, '1.2.01', 's', { loop: 0 });
      assertNote(seq.notes, 3, 4, '1.2.49', 'd', { loop: 0 });
    });

    testCommand('/q∞250asd', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { loop: 0 });
      assertNote(seq.notes, 1, 5, '1.1.49', 'a', { loop: 0.25 });
      assertNote(seq.notes, 2, 6, '1.2.01', 's', { loop: 0 });
      assertNote(seq.notes, 3, 7, '1.2.49', 'd', { loop: 0 });
    });

    testCommand('/q∞250[as]d', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { loop: 0 });
      assertNote(seq.notes, 1, 6, '1.1.49', 'a', { loop: 0.25 });
      assertNote(seq.notes, 2, 7, '1.2.01', 's', { loop: 0.25 });
      assertNote(seq.notes, 3, 9, '1.2.49', 'd', { loop: 0 });
    });

    testCommand('/q∞250[a∞s]d', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'q', { loop: 0 });
      assertNote(seq.notes, 1, 6, '1.1.49', 'a', { loop: 0.25 });
      assertNote(seq.notes, 2, 8, '1.2.01', 's', { loop: 0.1 });
      assertNote(seq.notes, 3, 10, '1.2.49', 'd', { loop: 0 });
    });

    testCommand('/f∆oo', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 2, '1.1.49', 'o', { bitcrush: 12, bitcrushFreq: 0, bitcrushMix: 0 });
      assertNote(seq.notes, 2, 3, '1.2.01', 'o', { bitcrush: 0 });
    });

    testCommand('/f∆10oo', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 4, '1.1.49', 'o', { bitcrush: 10, bitcrushFreq: 0, bitcrushMix: 0 });
      assertNote(seq.notes, 2, 5, '1.2.01', 'o', { bitcrush: 0 });
    });

    testCommand('/f∆8|40|80oo', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 9, '1.1.49', 'o', { bitcrush: 8, bitcrushFreq: 40, bitcrushMix: 80 });
      assertNote(seq.notes, 2, 10, '1.2.01', 'o', { bitcrush: 0 });
    });

    testCommand('/f∆8||80oo', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 7, '1.1.49', 'o', { bitcrush: 8, bitcrushFreq: 0, bitcrushMix: 80 });
      assertNote(seq.notes, 2, 8, '1.2.01', 'o', { bitcrush: 0 });
    });

    testCommand('/f∆|40|80oo', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 8, '1.1.49', 'o', { bitcrush: 12, bitcrushFreq: 40, bitcrushMix: 80 });
      assertNote(seq.notes, 2, 9, '1.2.01', 'o', { bitcrush: 0 });
    });

    testCommand('/f∆8|40|80[oo]', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 10, '1.1.49', 'o', { bitcrush: 8, bitcrushFreq: 40, bitcrushMix: 80 });
      assertNote(seq.notes, 2, 11, '1.2.01', 'o', { bitcrush: 8, bitcrushFreq: 40, bitcrushMix: 80 });
    });

    testCommand('/f∆8|40|80[o∆o]', function (pattern) {
      var seq = pattern.sequences[0];
      assertNote(seq.notes, 0, 0, '1.1.01', 'f', { bitcrush: 0 });
      assertNote(seq.notes, 1, 10, '1.1.49', 'o', { bitcrush: 8, bitcrushFreq: 40, bitcrushMix: 80 });
      assertNote(seq.notes, 2, 12, '1.2.01', 'o', { bitcrush: 12, bitcrushFreq: 0, bitcrushMix: 0 });
    });
  });
});
