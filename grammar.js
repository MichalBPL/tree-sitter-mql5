/**
 * @file MQL5 grammar for tree-sitter (extends C++)
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const CPP = require('tree-sitter-cpp/grammar');

module.exports = grammar(CPP, {
  name: 'mql5',

  externals: ($, original) => [
    ...original,
    $.color_literal,
  ],

  rules: {
    // Add input/sinput to storage class specifiers
    storage_class_specifier: (_, original) => choice(
      original,
      'input',
      'sinput',
    ),

    // Add MQL5-specific primitive types
    primitive_type: _ => token(choice(
      'bool', 'char', 'int', 'float', 'double', 'void',
      'size_t', 'ssize_t', 'ptrdiff_t', 'intptr_t', 'uintptr_t',
      'charptr_t', 'nullptr_t', 'max_align_t',
      ...[8, 16, 32, 64].map(n => `int${n}_t`),
      ...[8, 16, 32, 64].map(n => `uint${n}_t`),
      ...[8, 16, 32, 64].map(n => `char${n}_t`),
      'datetime', 'color', 'string',
      'uchar', 'ushort', 'uint', 'ulong',
      'long',
    )),

    // Add color_literal (external scanner token) to expressions
    _expression_not_binary: ($, original) => choice(
      original,
      $.color_literal,
    ),
  },
});
