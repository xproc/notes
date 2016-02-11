// This file was generated on Thu Feb 11, 2016 16:06 (UTC+01) by REx v5.35 which is Copyright (c) 1979-2015 by Gunther Rademacher <grd@gmx.net>
// REx command line: grammar.ebnf -ll 3 -javascript -tree

function grammar(string, parsingEventHandler)
{
  init(string, parsingEventHandler);

  var self = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var
      begin = b,
      end = e,
      state = s,
      offending = o,
      expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};

    this.getMessage = function()
    {
      return offending < 0 ? "lexical analysis failed" : "syntax error";
    };
  };

  function init(string, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = string;
    size = string.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  function reset(l, b, e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    l2 = 0;
    l3 = 0;
    end = e;
    eventHandler.reset(input);
  }

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? grammar.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = grammar.getTokenSet(- e.getState());
    }
    else
    {
      expected = [grammar.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var tokenSet = this.getExpectedTokenSet(e);
    var found = this.getOffendingToken(e);
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    var size = e.getEnd() - e.getBegin();
    return e.getMessage()
         + (found == null ? "" : ", found " + found)
         + "\nwhile expecting "
         + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
         + "\n"
         + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ")
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_XProc = function()
  {
    eventHandler.startNonterminal("XProc", e0);
    lookahead1W(60);                // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'declare' |
                                    // 'if' | 'import' | 'inputs' | 'let' | 'option' | 'outputs' | 'step' | 'xproc' |
                                    // '{'
    whitespace();
    parse_XProcModule();
    shift(10);                      // EOF
    eventHandler.endNonterminal("XProc", e0);
  };

  function parse_XProcModule()
  {
    eventHandler.startNonterminal("XProcModule", e0);
    if (l1 == 101)                  // 'xproc'
    {
      parse_XProcVersionDecl();
    }
    lookahead1W(58);                // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'declare' |
                                    // 'if' | 'import' | 'inputs' | 'let' | 'option' | 'outputs' | 'step' | '{'
    whitespace();
    parse_XProcProlog();
    if (l1 != 10)                   // EOF
    {
      whitespace();
      parse_XProcFlow();
    }
    eventHandler.endNonterminal("XProcModule", e0);
  }

  function parse_XProcVersionDecl()
  {
    eventHandler.startNonterminal("XProcVersionDecl", e0);
    shift(101);                     // 'xproc'
    lookahead1W(20);                // S^WS | '(:' | 'version'
    shift(100);                     // 'version'
    lookahead1W(12);                // S^WS | '(:' | '='
    shift(33);                      // '='
    lookahead1W(1);                 // StringLiteral | S^WS | '(:'
    shift(4);                       // StringLiteral
    lookahead1W(11);                // S^WS | '(:' | ';'
    whitespace();
    parse_XProcSeparator();
    eventHandler.endNonterminal("XProcVersionDecl", e0);
  }

  function parse_XProcProlog()
  {
    eventHandler.startNonterminal("XProcProlog", e0);
    for (;;)
    {
      lookahead1W(58);              // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'declare' |
                                    // 'if' | 'import' | 'inputs' | 'let' | 'option' | 'outputs' | 'step' | '{'
      if (l1 != 52                  // 'declare'
       && l1 != 68)                 // 'import'
      {
        break;
      }
      switch (l1)
      {
      case 52:                      // 'declare'
        lookahead2W(34);            // S^WS | '(:' | 'default' | 'namespace'
        break;
      default:
        lk = l1;
      }
      switch (lk)
      {
      case 6836:                    // 'declare' 'default'
        whitespace();
        parse_XProcDefaultNamespaceDecl();
        break;
      case 10164:                   // 'declare' 'namespace'
        whitespace();
        parse_XProcNamespaceDecl();
        break;
      default:
        whitespace();
        parse_XProcImport();
      }
      lookahead1W(11);              // S^WS | '(:' | ';'
      whitespace();
      parse_XProcSeparator();
    }
    if (l1 == 69)                   // 'inputs'
    {
      whitespace();
      parse_XProcInputs();
      whitespace();
      parse_XProcSeparator();
    }
    lookahead1W(56);                // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'if' |
                                    // 'let' | 'option' | 'outputs' | 'step' | '{'
    if (l1 == 86)                   // 'outputs'
    {
      whitespace();
      parse_XProcOutputs();
      whitespace();
      parse_XProcSeparator();
    }
    for (;;)
    {
      lookahead1W(53);              // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'if' |
                                    // 'let' | 'option' | 'step' | '{'
      if (l1 != 84)                 // 'option'
      {
        break;
      }
      whitespace();
      parse_XProcOptionDecl();
      lookahead1W(11);              // S^WS | '(:' | ';'
      whitespace();
      parse_XProcSeparator();
    }
    for (;;)
    {
      lookahead1W(51);              // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'if' |
                                    // 'let' | 'step' | '{'
      if (l1 != 93)                 // 'step'
      {
        break;
      }
      whitespace();
      parse_XProcStepDecl();
      whitespace();
      parse_XProcSeparator();
    }
    eventHandler.endNonterminal("XProcProlog", e0);
  }

  function parse_XProcImport()
  {
    eventHandler.startNonterminal("XProcImport", e0);
    shift(68);                      // 'import'
    lookahead1W(1);                 // StringLiteral | S^WS | '(:'
    whitespace();
    parse_XProcURILiteral();
    eventHandler.endNonterminal("XProcImport", e0);
  }

  function parse_XProcInputs()
  {
    eventHandler.startNonterminal("XProcInputs", e0);
    shift(69);                      // 'inputs'
    lookahead1W(4);                 // S^WS | '$' | '(:'
    whitespace();
    parse_XProcParamList();
    eventHandler.endNonterminal("XProcInputs", e0);
  }

  function parse_XProcOutputs()
  {
    eventHandler.startNonterminal("XProcOutputs", e0);
    shift(86);                      // 'outputs'
    lookahead1W(4);                 // S^WS | '$' | '(:'
    whitespace();
    parse_XProcParamList();
    eventHandler.endNonterminal("XProcOutputs", e0);
  }

  function parse_XProcOptionDecl()
  {
    eventHandler.startNonterminal("XProcOptionDecl", e0);
    shift(84);                      // 'option'
    lookahead1W(4);                 // S^WS | '$' | '(:'
    whitespace();
    parse_XProcParam();
    eventHandler.endNonterminal("XProcOptionDecl", e0);
  }

  function parse_XProcStepDecl()
  {
    eventHandler.startNonterminal("XProcStepDecl", e0);
    shift(93);                      // 'step'
    lookahead1W(3);                 // QName^Token | S^WS | '(:'
    whitespace();
    parse_FunctionName();
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(26);                // S^WS | '$' | '(:' | ')'
    if (l1 == 14)                   // '$'
    {
      whitespace();
      parse_XProcParamList();
    }
    shift(17);                      // ')'
    lookahead1W(41);                // S^WS | '(:' | ';' | 'inputs' | 'outputs'
    if (l1 == 69)                   // 'inputs'
    {
      whitespace();
      parse_XProcInputs();
    }
    if (l1 == 86)                   // 'outputs'
    {
      whitespace();
      parse_XProcOutputs();
    }
    eventHandler.endNonterminal("XProcStepDecl", e0);
  }

  function parse_XProcFlow()
  {
    eventHandler.startNonterminal("XProcFlow", e0);
    for (;;)
    {
      whitespace();
      parse_XProcFlowStatement();
      lookahead1W(52);              // StringLiteral | QName^Token | S^WS | EOF | '$' | '(' | '(:' | '[' | 'if' |
                                    // 'let' | '{' | '}'
      if (l1 == 10                  // EOF
       || l1 == 105)                // '}'
      {
        break;
      }
    }
    eventHandler.endNonterminal("XProcFlow", e0);
  }

  function parse_XProcFlowStatement()
  {
    eventHandler.startNonterminal("XProcFlowStatement", e0);
    switch (l1)
    {
    case 67:                        // 'if'
      parse_XProcIfStatement();
      break;
    case 75:                        // 'let'
      parse_XProcLetStatement();
      break;
    default:
      parse_XProcStepChain();
      if (l1 == 37                  // '>>'
       || l1 == 107)                // '≫'
      {
        whitespace();
        parse_XProcOutputBinding();
      }
    }
    eventHandler.endNonterminal("XProcFlowStatement", e0);
  }

  function parse_XProcStepChain()
  {
    eventHandler.startNonterminal("XProcStepChain", e0);
    switch (l1)
    {
    case 4:                         // StringLiteral
    case 14:                        // '$'
    case 15:                        // '('
      parse_XProcSequenceLiteral();
      for (;;)
      {
        lookahead1W(48);            // S^WS | '!' | '(:' | '=>' | 'replace' | 'tee' | '→' | '⊤'
        whitespace();
        parse_XProcStepChainItem();
        lookahead1W(61);            // StringLiteral | QName^Token | S^WS | EOF | '!' | '$' | '(' | '(:' | '=>' | '>>' |
                                    // '[' | 'else' | 'if' | 'let' | 'replace' | 'tee' | '{' | '}' | '→' | '≫' | '⊤'
        if (l1 != 12                // '!'
         && l1 != 34                // '=>'
         && l1 != 91                // 'replace'
         && l1 != 94                // 'tee'
         && l1 != 106               // '→'
         && l1 != 108)              // '⊤'
        {
          break;
        }
      }
      break;
    default:
      switch (l1)
      {
      case 102:                     // '{'
        parse_XProcBlockStatement();
        break;
      default:
        parse_XProcStepInvocation();
      }
      for (;;)
      {
        lookahead1W(61);            // StringLiteral | QName^Token | S^WS | EOF | '!' | '$' | '(' | '(:' | '=>' | '>>' |
                                    // '[' | 'else' | 'if' | 'let' | 'replace' | 'tee' | '{' | '}' | '→' | '≫' | '⊤'
        if (l1 != 12                // '!'
         && l1 != 34                // '=>'
         && l1 != 91                // 'replace'
         && l1 != 94                // 'tee'
         && l1 != 106               // '→'
         && l1 != 108)              // '⊤'
        {
          break;
        }
        whitespace();
        parse_XProcStepChainItem();
      }
    }
    eventHandler.endNonterminal("XProcStepChain", e0);
  }

  function parse_XProcStepChainItem()
  {
    eventHandler.startNonterminal("XProcStepChainItem", e0);
    switch (l1)
    {
    case 34:                        // '=>'
    case 106:                       // '→'
      parse_XProcChainedItem();
      break;
    case 12:                        // '!'
      parse_XProcIteratedItem();
      break;
    case 91:                        // 'replace'
      parse_XProcReplacedItem();
      break;
    default:
      parse_XProcTeedItem();
    }
    eventHandler.endNonterminal("XProcStepChainItem", e0);
  }

  function parse_XProcSequenceLiteral()
  {
    eventHandler.startNonterminal("XProcSequenceLiteral", e0);
    switch (l1)
    {
    case 15:                        // '('
      shift(15);                    // '('
      lookahead1W(24);              // StringLiteral | S^WS | '$' | '(:'
      whitespace();
      parse_XProcSequenceItem();
      for (;;)
      {
        lookahead1W(28);            // S^WS | '(:' | ')' | ','
        if (l1 != 20)               // ','
        {
          break;
        }
        shift(20);                  // ','
        lookahead1W(24);            // StringLiteral | S^WS | '$' | '(:'
        whitespace();
        parse_XProcSequenceItem();
      }
      shift(17);                    // ')'
      break;
    default:
      parse_XProcSequenceItem();
    }
    eventHandler.endNonterminal("XProcSequenceLiteral", e0);
  }

  function parse_XProcSequenceItem()
  {
    eventHandler.startNonterminal("XProcSequenceItem", e0);
    switch (l1)
    {
    case 4:                         // StringLiteral
      parse_XProcURILiteral();
      break;
    default:
      parse_XProcPortInput();
    }
    eventHandler.endNonterminal("XProcSequenceItem", e0);
  }

  function parse_XProcChainedItem()
  {
    eventHandler.startNonterminal("XProcChainedItem", e0);
    parse_XProcArrow();
    lookahead1W(40);                // QName^Token | S^WS | '(:' | '[' | '{'
    whitespace();
    parse_XProcChainItem();
    eventHandler.endNonterminal("XProcChainedItem", e0);
  }

  function parse_XProcIteratedItem()
  {
    eventHandler.startNonterminal("XProcIteratedItem", e0);
    parse_XProcIteration();
    lookahead1W(21);                // S^WS | '(:' | '{'
    whitespace();
    parse_XProcBlockStatement();
    eventHandler.endNonterminal("XProcIteratedItem", e0);
  }

  function parse_XProcTeedItem()
  {
    eventHandler.startNonterminal("XProcTeedItem", e0);
    parse_XProcTee();
    lookahead1W(21);                // S^WS | '(:' | '{'
    whitespace();
    parse_XProcBlockStatement();
    lookahead1W(33);                // S^WS | '(:' | '=>' | '→'
    whitespace();
    parse_XProcChainedItem();
    eventHandler.endNonterminal("XProcTeedItem", e0);
  }

  function parse_XProcReplacedItem()
  {
    eventHandler.startNonterminal("XProcReplacedItem", e0);
    parse_XProcReplace();
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(63);                // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '.' |
                                    // '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
    whitespace();
    parse_PathExpr();
    shift(17);                      // ')'
    lookahead1W(21);                // S^WS | '(:' | '{'
    whitespace();
    parse_XProcBlockStatement();
    eventHandler.endNonterminal("XProcReplacedItem", e0);
  }

  function parse_XProcChainItem()
  {
    eventHandler.startNonterminal("XProcChainItem", e0);
    switch (l1)
    {
    case 102:                       // '{'
      parse_XProcBlockStatement();
      break;
    default:
      parse_XProcStepInvocation();
    }
    eventHandler.endNonterminal("XProcChainItem", e0);
  }

  function parse_XProcArrow()
  {
    eventHandler.startNonterminal("XProcArrow", e0);
    switch (l1)
    {
    case 34:                        // '=>'
      shift(34);                    // '=>'
      break;
    default:
      shift(106);                   // '→'
    }
    eventHandler.endNonterminal("XProcArrow", e0);
  }

  function parse_XProcIteration()
  {
    eventHandler.startNonterminal("XProcIteration", e0);
    shift(12);                      // '!'
    eventHandler.endNonterminal("XProcIteration", e0);
  }

  function parse_XProcTee()
  {
    eventHandler.startNonterminal("XProcTee", e0);
    switch (l1)
    {
    case 94:                        // 'tee'
      shift(94);                    // 'tee'
      break;
    default:
      shift(108);                   // '⊤'
    }
    eventHandler.endNonterminal("XProcTee", e0);
  }

  function parse_XProcReplace()
  {
    eventHandler.startNonterminal("XProcReplace", e0);
    shift(91);                      // 'replace'
    eventHandler.endNonterminal("XProcReplace", e0);
  }

  function parse_XProcInputPortList()
  {
    eventHandler.startNonterminal("XProcInputPortList", e0);
    shift(40);                      // '['
    lookahead1W(42);                // StringLiteral | QName^Token | S^WS | '$' | '(' | '(:'
    whitespace();
    parse_XProcInputPortBinding();
    for (;;)
    {
      lookahead1W(31);              // S^WS | '(:' | ',' | ']'
      if (l1 != 20)                 // ','
      {
        break;
      }
      shift(20);                    // ','
      lookahead1W(42);              // StringLiteral | QName^Token | S^WS | '$' | '(' | '(:'
      whitespace();
      parse_XProcInputPortBinding();
    }
    shift(41);                      // ']'
    eventHandler.endNonterminal("XProcInputPortList", e0);
  }

  function parse_XProcInputPortBinding()
  {
    eventHandler.startNonterminal("XProcInputPortBinding", e0);
    if (l1 == 7)                    // QName^Token
    {
      parse_QName();
      lookahead1W(12);              // S^WS | '(:' | '='
      shift(33);                    // '='
    }
    lookahead1W(37);                // StringLiteral | S^WS | '$' | '(' | '(:'
    whitespace();
    parse_XProcSequenceLiteral();
    eventHandler.endNonterminal("XProcInputPortBinding", e0);
  }

  function parse_XProcInputOrdinal()
  {
    eventHandler.startNonterminal("XProcInputOrdinal", e0);
    shift(14);                      // '$'
    lookahead1W(0);                 // IntegerLiteral | S^WS | '(:'
    shift(1);                       // IntegerLiteral
    eventHandler.endNonterminal("XProcInputOrdinal", e0);
  }

  function parse_XProcOutputBinding()
  {
    eventHandler.startNonterminal("XProcOutputBinding", e0);
    parse_XProcAppend();
    lookahead1W(44);                // StringLiteral | S^WS | '$' | '(:' | '@' | '['
    switch (l1)
    {
    case 40:                        // '['
      whitespace();
      parse_XProcOutputPortList();
      break;
    default:
      whitespace();
      parse_XProcOutputItem();
    }
    eventHandler.endNonterminal("XProcOutputBinding", e0);
  }

  function parse_XProcAppend()
  {
    eventHandler.startNonterminal("XProcAppend", e0);
    switch (l1)
    {
    case 37:                        // '>>'
      shift(37);                    // '>>'
      break;
    default:
      shift(107);                   // '≫'
    }
    eventHandler.endNonterminal("XProcAppend", e0);
  }

  function parse_XProcOutputItem()
  {
    eventHandler.startNonterminal("XProcOutputItem", e0);
    switch (l1)
    {
    case 4:                         // StringLiteral
      parse_XProcURILiteral();
      break;
    case 14:                        // '$'
      parse_XProcPortRef();
      break;
    default:
      parse_XProcOutputOrdinal();
    }
    eventHandler.endNonterminal("XProcOutputItem", e0);
  }

  function parse_XProcOutputOrdinal()
  {
    eventHandler.startNonterminal("XProcOutputOrdinal", e0);
    shift(39);                      // '@'
    lookahead1W(0);                 // IntegerLiteral | S^WS | '(:'
    shift(1);                       // IntegerLiteral
    eventHandler.endNonterminal("XProcOutputOrdinal", e0);
  }

  function parse_XProcOutputPortList()
  {
    eventHandler.startNonterminal("XProcOutputPortList", e0);
    shift(40);                      // '['
    lookahead1W(43);                // StringLiteral | QName^Token | S^WS | '$' | '(:' | '@'
    whitespace();
    parse_XProcOutputPortBinding();
    lookahead1W(8);                 // S^WS | '(:' | ','
    shift(20);                      // ','
    lookahead1W(43);                // StringLiteral | QName^Token | S^WS | '$' | '(:' | '@'
    whitespace();
    parse_XProcOutputPortBinding();
    lookahead1W(13);                // S^WS | '(:' | ']'
    shift(41);                      // ']'
    eventHandler.endNonterminal("XProcOutputPortList", e0);
  }

  function parse_XProcOutputPortBinding()
  {
    eventHandler.startNonterminal("XProcOutputPortBinding", e0);
    if (l1 == 7)                    // QName^Token
    {
      parse_QName();
      lookahead1W(12);              // S^WS | '(:' | '='
      shift(33);                    // '='
    }
    lookahead1W(38);                // StringLiteral | S^WS | '$' | '(:' | '@'
    whitespace();
    parse_XProcOutputItem();
    eventHandler.endNonterminal("XProcOutputPortBinding", e0);
  }

  function parse_XProcPortInput()
  {
    eventHandler.startNonterminal("XProcPortInput", e0);
    switch (l1)
    {
    case 14:                        // '$'
      lookahead2W(23);              // IntegerLiteral | QName^Token | S^WS | '(:'
      break;
    default:
      lk = l1;
    }
    switch (lk)
    {
    case 910:                       // '$' QName^Token
      parse_XProcPortRef();
      break;
    default:
      parse_XProcInputOrdinal();
    }
    lookahead1W(55);                // S^WS | '!' | '(:' | ')' | ',' | '/' | '//' | '=>' | ']' | 'replace' | 'tee' |
                                    // '→' | '⊤'
    if (l1 == 24                    // '/'
     || l1 == 25)                   // '//'
    {
      whitespace();
      parse_XProcProjection();
    }
    eventHandler.endNonterminal("XProcPortInput", e0);
  }

  function parse_XProcPortRef()
  {
    eventHandler.startNonterminal("XProcPortRef", e0);
    shift(14);                      // '$'
    lookahead1W(3);                 // QName^Token | S^WS | '(:'
    whitespace();
    parse_QName();
    eventHandler.endNonterminal("XProcPortRef", e0);
  }

  function parse_XProcProjection()
  {
    eventHandler.startNonterminal("XProcProjection", e0);
    switch (l1)
    {
    case 24:                        // '/'
      shift(24);                    // '/'
      lookahead1W(74);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '!' | '$' | '(' | '(:' | ')' |
                                    // ',' | '.' | '..' | '=>' | '@' | ']' | 'ancestor' | 'ancestor-or-self' |
                                    // 'attribute' | 'child' | 'comment' | 'descendant' | 'descendant-or-self' |
                                    // 'document-node' | 'element' | 'following' | 'following-sibling' |
                                    // 'namespace-node' | 'node' | 'parent' | 'preceding' | 'preceding-sibling' |
                                    // 'processing-instruction' | 'replace' | 'self' | 'tee' | 'text' | '→' | '⊤'
      switch (l1)
      {
      case 12:                      // '!'
      case 17:                      // ')'
      case 20:                      // ','
      case 34:                      // '=>'
      case 41:                      // ']'
      case 91:                      // 'replace'
      case 94:                      // 'tee'
      case 106:                     // '→'
      case 108:                     // '⊤'
        break;
      default:
        whitespace();
        parse_RelativePathExpr();
      }
      break;
    default:
      shift(25);                    // '//'
      lookahead1W(62);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '.' |
                                    // '..' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' | 'child' |
                                    // 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' | 'element' |
                                    // 'following' | 'following-sibling' | 'namespace-node' | 'node' | 'parent' |
                                    // 'preceding' | 'preceding-sibling' | 'processing-instruction' | 'self' | 'text'
      whitespace();
      parse_RelativePathExpr();
    }
    eventHandler.endNonterminal("XProcProjection", e0);
  }

  function parse_XProcStepInvocation()
  {
    eventHandler.startNonterminal("XProcStepInvocation", e0);
    if (l1 == 40)                   // '['
    {
      parse_XProcInputPortList();
      lookahead1W(33);              // S^WS | '(:' | '=>' | '→'
      whitespace();
      parse_XProcArrow();
    }
    lookahead1W(3);                 // QName^Token | S^WS | '(:'
    whitespace();
    parse_XProcStepName();
    lookahead1W(5);                 // S^WS | '(' | '(:'
    whitespace();
    parse_XProcArgumentList();
    eventHandler.endNonterminal("XProcStepInvocation", e0);
  }

  function parse_XProcStepName()
  {
    eventHandler.startNonterminal("XProcStepName", e0);
    parse_QName();
    eventHandler.endNonterminal("XProcStepName", e0);
  }

  function parse_XProcArgumentList()
  {
    eventHandler.startNonterminal("XProcArgumentList", e0);
    parse_ArgumentList();
    eventHandler.endNonterminal("XProcArgumentList", e0);
  }

  function parse_XProcBlockStatement()
  {
    eventHandler.startNonterminal("XProcBlockStatement", e0);
    shift(102);                     // '{'
    lookahead1W(50);                // StringLiteral | QName^Token | S^WS | '$' | '(' | '(:' | '[' | 'if' | 'let' |
                                    // '{' | '}'
    if (l1 != 105)                  // '}'
    {
      whitespace();
      parse_XProcFlow();
    }
    shift(105);                     // '}'
    eventHandler.endNonterminal("XProcBlockStatement", e0);
  }

  function parse_XProcIfStatement()
  {
    eventHandler.startNonterminal("XProcIfStatement", e0);
    shift(67);                      // 'if'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(66);                // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
    whitespace();
    parse_ExprSingle();
    shift(17);                      // ')'
    lookahead1W(19);                // S^WS | '(:' | 'then'
    shift(96);                      // 'then'
    lookahead1W(49);                // StringLiteral | QName^Token | S^WS | '$' | '(' | '(:' | '[' | 'if' | 'let' | '{'
    whitespace();
    parse_XProcFlowStatement();
    lookahead1W(16);                // S^WS | '(:' | 'else'
    shift(59);                      // 'else'
    lookahead1W(49);                // StringLiteral | QName^Token | S^WS | '$' | '(' | '(:' | '[' | 'if' | 'let' | '{'
    whitespace();
    parse_XProcFlowStatement();
    eventHandler.endNonterminal("XProcIfStatement", e0);
  }

  function parse_XProcLetStatement()
  {
    eventHandler.startNonterminal("XProcLetStatement", e0);
    shift(75);                      // 'let'
    lookahead1W(4);                 // S^WS | '$' | '(:'
    whitespace();
    parse_XProcLetBinding();
    for (;;)
    {
      if (l1 != 20)                 // ','
      {
        break;
      }
      shift(20);                    // ','
      lookahead1W(4);               // S^WS | '$' | '(:'
      whitespace();
      parse_XProcLetBinding();
    }
    whitespace();
    parse_XProcLetBody();
    eventHandler.endNonterminal("XProcLetStatement", e0);
  }

  function parse_XProcLetBody()
  {
    eventHandler.startNonterminal("XProcLetBody", e0);
    parse_XProcBlockStatement();
    eventHandler.endNonterminal("XProcLetBody", e0);
  }

  function parse_XProcLetBinding()
  {
    eventHandler.startNonterminal("XProcLetBinding", e0);
    shift(14);                      // '$'
    lookahead1W(25);                // URIQualifiedName | QName^Token | S^WS | '(:'
    whitespace();
    parse_VarName();
    lookahead1W(32);                // S^WS | '(:' | ':=' | 'as'
    if (l1 == 46)                   // 'as'
    {
      whitespace();
      parse_XProcTypeDeclaration();
    }
    lookahead1W(10);                // S^WS | '(:' | ':='
    shift(28);                      // ':='
    lookahead1W(66);                // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
    whitespace();
    parse_ExprSingle();
    eventHandler.endNonterminal("XProcLetBinding", e0);
  }

  function parse_XProcNamespaceDecl()
  {
    eventHandler.startNonterminal("XProcNamespaceDecl", e0);
    shift(52);                      // 'declare'
    lookahead1W(17);                // S^WS | '(:' | 'namespace'
    shift(79);                      // 'namespace'
    lookahead1W(2);                 // NCName^Token | S^WS | '(:'
    whitespace();
    parse_NCName();
    lookahead1W(12);                // S^WS | '(:' | '='
    shift(33);                      // '='
    lookahead1W(1);                 // StringLiteral | S^WS | '(:'
    whitespace();
    parse_XProcURILiteral();
    eventHandler.endNonterminal("XProcNamespaceDecl", e0);
  }

  function parse_XProcDefaultNamespaceDecl()
  {
    eventHandler.startNonterminal("XProcDefaultNamespaceDecl", e0);
    shift(52);                      // 'declare'
    lookahead1W(15);                // S^WS | '(:' | 'default'
    shift(53);                      // 'default'
    lookahead1W(17);                // S^WS | '(:' | 'namespace'
    shift(79);                      // 'namespace'
    lookahead1W(1);                 // StringLiteral | S^WS | '(:'
    whitespace();
    parse_XProcURILiteral();
    eventHandler.endNonterminal("XProcDefaultNamespaceDecl", e0);
  }

  function parse_XProcParamList()
  {
    eventHandler.startNonterminal("XProcParamList", e0);
    parse_XProcParam();
    for (;;)
    {
      lookahead1W(46);              // S^WS | '(:' | ')' | ',' | ';' | 'outputs'
      if (l1 != 20)                 // ','
      {
        break;
      }
      shift(20);                    // ','
      lookahead1W(4);               // S^WS | '$' | '(:'
      whitespace();
      parse_XProcParam();
    }
    eventHandler.endNonterminal("XProcParamList", e0);
  }

  function parse_XProcParam()
  {
    eventHandler.startNonterminal("XProcParam", e0);
    shift(14);                      // '$'
    lookahead1W(3);                 // QName^Token | S^WS | '(:'
    whitespace();
    parse_QName();
    lookahead1W(47);                // S^WS | '(:' | ')' | ',' | ';' | 'as' | 'outputs'
    if (l1 == 46)                   // 'as'
    {
      whitespace();
      parse_XProcTypeDeclaration();
    }
    eventHandler.endNonterminal("XProcParam", e0);
  }

  function parse_XProcTypeDeclaration()
  {
    eventHandler.startNonterminal("XProcTypeDeclaration", e0);
    shift(46);                      // 'as'
    lookahead1W(57);                // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | 'array' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'item' | 'map' | 'namespace-node' |
                                    // 'node' | 'processing-instruction' | 'text'
    whitespace();
    parse_SequenceType();
    eventHandler.endNonterminal("XProcTypeDeclaration", e0);
  }

  function parse_XProcSeparator()
  {
    eventHandler.startNonterminal("XProcSeparator", e0);
    shift(29);                      // ';'
    eventHandler.endNonterminal("XProcSeparator", e0);
  }

  function parse_XProcURILiteral()
  {
    eventHandler.startNonterminal("XProcURILiteral", e0);
    shift(4);                       // StringLiteral
    eventHandler.endNonterminal("XProcURILiteral", e0);
  }

  function parse_Expr()
  {
    eventHandler.startNonterminal("Expr", e0);
    parse_ExprSingle();
    for (;;)
    {
      if (l1 != 20)                 // ','
      {
        break;
      }
      shift(20);                    // ','
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_ExprSingle();
    }
    eventHandler.endNonterminal("Expr", e0);
  }

  function parse_ExprSingle()
  {
    eventHandler.startNonterminal("ExprSingle", e0);
    parse_OrExpr();
    eventHandler.endNonterminal("ExprSingle", e0);
  }

  function parse_OrExpr()
  {
    eventHandler.startNonterminal("OrExpr", e0);
    parse_AndExpr();
    for (;;)
    {
      if (l1 != 85)                 // 'or'
      {
        break;
      }
      shift(85);                    // 'or'
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_AndExpr();
    }
    eventHandler.endNonterminal("OrExpr", e0);
  }

  function parse_AndExpr()
  {
    eventHandler.startNonterminal("AndExpr", e0);
    parse_ComparisonExpr();
    for (;;)
    {
      if (l1 != 44)                 // 'and'
      {
        break;
      }
      shift(44);                    // 'and'
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_ComparisonExpr();
    }
    eventHandler.endNonterminal("AndExpr", e0);
  }

  function parse_ComparisonExpr()
  {
    eventHandler.startNonterminal("ComparisonExpr", e0);
    parse_StringConcatExpr();
    if (l1 != 17                    // ')'
     && l1 != 20                    // ','
     && l1 != 41                    // ']'
     && l1 != 44                    // 'and'
     && l1 != 85                    // 'or'
     && l1 != 102)                  // '{'
    {
      switch (l1)
      {
      case 60:                      // 'eq'
      case 64:                      // 'ge'
      case 65:                      // 'gt'
      case 74:                      // 'le'
      case 76:                      // 'lt'
      case 81:                      // 'ne'
        whitespace();
        parse_ValueComp();
        break;
      case 31:                      // '<<'
      case 37:                      // '>>'
      case 72:                      // 'is'
        whitespace();
        parse_NodeComp();
        break;
      default:
        whitespace();
        parse_GeneralComp();
      }
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_StringConcatExpr();
    }
    eventHandler.endNonterminal("ComparisonExpr", e0);
  }

  function parse_StringConcatExpr()
  {
    eventHandler.startNonterminal("StringConcatExpr", e0);
    parse_RangeExpr();
    for (;;)
    {
      if (l1 != 104)                // '||'
      {
        break;
      }
      shift(104);                   // '||'
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_RangeExpr();
    }
    eventHandler.endNonterminal("StringConcatExpr", e0);
  }

  function parse_RangeExpr()
  {
    eventHandler.startNonterminal("RangeExpr", e0);
    parse_AdditiveExpr();
    if (l1 == 97)                   // 'to'
    {
      shift(97);                    // 'to'
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_AdditiveExpr();
    }
    eventHandler.endNonterminal("RangeExpr", e0);
  }

  function parse_AdditiveExpr()
  {
    eventHandler.startNonterminal("AdditiveExpr", e0);
    parse_MultiplicativeExpr();
    for (;;)
    {
      if (l1 != 19                  // '+'
       && l1 != 21)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 19:                      // '+'
        shift(19);                  // '+'
        break;
      default:
        shift(21);                  // '-'
      }
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_MultiplicativeExpr();
    }
    eventHandler.endNonterminal("AdditiveExpr", e0);
  }

  function parse_MultiplicativeExpr()
  {
    eventHandler.startNonterminal("MultiplicativeExpr", e0);
    parse_UnionExpr();
    for (;;)
    {
      if (l1 != 18                  // '*'
       && l1 != 56                  // 'div'
       && l1 != 66                  // 'idiv'
       && l1 != 78)                 // 'mod'
      {
        break;
      }
      switch (l1)
      {
      case 18:                      // '*'
        shift(18);                  // '*'
        break;
      case 56:                      // 'div'
        shift(56);                  // 'div'
        break;
      case 66:                      // 'idiv'
        shift(66);                  // 'idiv'
        break;
      default:
        shift(78);                  // 'mod'
      }
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_UnionExpr();
    }
    eventHandler.endNonterminal("MultiplicativeExpr", e0);
  }

  function parse_UnionExpr()
  {
    eventHandler.startNonterminal("UnionExpr", e0);
    parse_IntersectExceptExpr();
    for (;;)
    {
      if (l1 != 99                  // 'union'
       && l1 != 103)                // '|'
      {
        break;
      }
      switch (l1)
      {
      case 99:                      // 'union'
        shift(99);                  // 'union'
        break;
      default:
        shift(103);                 // '|'
      }
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_IntersectExceptExpr();
    }
    eventHandler.endNonterminal("UnionExpr", e0);
  }

  function parse_IntersectExceptExpr()
  {
    eventHandler.startNonterminal("IntersectExceptExpr", e0);
    parse_InstanceofExpr();
    for (;;)
    {
      lookahead1W(64);              // S^WS | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '<' | '<<' | '<=' | '=' |
                                    // '>' | '>=' | '>>' | ']' | 'and' | 'div' | 'eq' | 'except' | 'ge' | 'gt' |
                                    // 'idiv' | 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' | 'to' |
                                    // 'union' | '{' | '|' | '||'
      if (l1 != 61                  // 'except'
       && l1 != 71)                 // 'intersect'
      {
        break;
      }
      switch (l1)
      {
      case 71:                      // 'intersect'
        shift(71);                  // 'intersect'
        break;
      default:
        shift(61);                  // 'except'
      }
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_InstanceofExpr();
    }
    eventHandler.endNonterminal("IntersectExceptExpr", e0);
  }

  function parse_InstanceofExpr()
  {
    eventHandler.startNonterminal("InstanceofExpr", e0);
    parse_TreatExpr();
    lookahead1W(65);                // S^WS | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '<' | '<<' | '<=' | '=' |
                                    // '>' | '>=' | '>>' | ']' | 'and' | 'div' | 'eq' | 'except' | 'ge' | 'gt' |
                                    // 'idiv' | 'instance' | 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' |
                                    // 'to' | 'union' | '{' | '|' | '||'
    if (l1 == 70)                   // 'instance'
    {
      shift(70);                    // 'instance'
      lookahead1W(18);              // S^WS | '(:' | 'of'
      shift(83);                    // 'of'
      lookahead1W(57);              // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | 'array' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'item' | 'map' | 'namespace-node' |
                                    // 'node' | 'processing-instruction' | 'text'
      whitespace();
      parse_SequenceType();
    }
    eventHandler.endNonterminal("InstanceofExpr", e0);
  }

  function parse_TreatExpr()
  {
    eventHandler.startNonterminal("TreatExpr", e0);
    parse_CastableExpr();
    lookahead1W(67);                // S^WS | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '<' | '<<' | '<=' | '=' |
                                    // '>' | '>=' | '>>' | ']' | 'and' | 'div' | 'eq' | 'except' | 'ge' | 'gt' |
                                    // 'idiv' | 'instance' | 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' |
                                    // 'to' | 'treat' | 'union' | '{' | '|' | '||'
    if (l1 == 98)                   // 'treat'
    {
      shift(98);                    // 'treat'
      lookahead1W(14);              // S^WS | '(:' | 'as'
      shift(46);                    // 'as'
      lookahead1W(57);              // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | 'array' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'item' | 'map' | 'namespace-node' |
                                    // 'node' | 'processing-instruction' | 'text'
      whitespace();
      parse_SequenceType();
    }
    eventHandler.endNonterminal("TreatExpr", e0);
  }

  function parse_CastableExpr()
  {
    eventHandler.startNonterminal("CastableExpr", e0);
    parse_CastExpr();
    lookahead1W(70);                // S^WS | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '<' | '<<' | '<=' | '=' |
                                    // '>' | '>=' | '>>' | ']' | 'and' | 'castable' | 'div' | 'eq' | 'except' | 'ge' |
                                    // 'gt' | 'idiv' | 'instance' | 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' |
                                    // 'or' | 'to' | 'treat' | 'union' | '{' | '|' | '||'
    if (l1 == 49)                   // 'castable'
    {
      shift(49);                    // 'castable'
      lookahead1W(14);              // S^WS | '(:' | 'as'
      shift(46);                    // 'as'
      lookahead1W(25);              // URIQualifiedName | QName^Token | S^WS | '(:'
      whitespace();
      parse_SingleType();
    }
    eventHandler.endNonterminal("CastableExpr", e0);
  }

  function parse_CastExpr()
  {
    eventHandler.startNonterminal("CastExpr", e0);
    parse_UnaryExpr();
    if (l1 == 48)                   // 'cast'
    {
      shift(48);                    // 'cast'
      lookahead1W(14);              // S^WS | '(:' | 'as'
      shift(46);                    // 'as'
      lookahead1W(25);              // URIQualifiedName | QName^Token | S^WS | '(:'
      whitespace();
      parse_SingleType();
    }
    eventHandler.endNonterminal("CastExpr", e0);
  }

  function parse_UnaryExpr()
  {
    eventHandler.startNonterminal("UnaryExpr", e0);
    for (;;)
    {
      lookahead1W(66);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      if (l1 != 19                  // '+'
       && l1 != 21)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 21:                      // '-'
        shift(21);                  // '-'
        break;
      default:
        shift(19);                  // '+'
      }
    }
    whitespace();
    parse_ValueExpr();
    eventHandler.endNonterminal("UnaryExpr", e0);
  }

  function parse_ValueExpr()
  {
    eventHandler.startNonterminal("ValueExpr", e0);
    parse_SimpleMapExpr();
    eventHandler.endNonterminal("ValueExpr", e0);
  }

  function parse_GeneralComp()
  {
    eventHandler.startNonterminal("GeneralComp", e0);
    switch (l1)
    {
    case 33:                        // '='
      shift(33);                    // '='
      break;
    case 13:                        // '!='
      shift(13);                    // '!='
      break;
    case 30:                        // '<'
      shift(30);                    // '<'
      break;
    case 32:                        // '<='
      shift(32);                    // '<='
      break;
    case 35:                        // '>'
      shift(35);                    // '>'
      break;
    default:
      shift(36);                    // '>='
    }
    eventHandler.endNonterminal("GeneralComp", e0);
  }

  function parse_ValueComp()
  {
    eventHandler.startNonterminal("ValueComp", e0);
    switch (l1)
    {
    case 60:                        // 'eq'
      shift(60);                    // 'eq'
      break;
    case 81:                        // 'ne'
      shift(81);                    // 'ne'
      break;
    case 76:                        // 'lt'
      shift(76);                    // 'lt'
      break;
    case 74:                        // 'le'
      shift(74);                    // 'le'
      break;
    case 65:                        // 'gt'
      shift(65);                    // 'gt'
      break;
    default:
      shift(64);                    // 'ge'
    }
    eventHandler.endNonterminal("ValueComp", e0);
  }

  function parse_NodeComp()
  {
    eventHandler.startNonterminal("NodeComp", e0);
    switch (l1)
    {
    case 72:                        // 'is'
      shift(72);                    // 'is'
      break;
    case 31:                        // '<<'
      shift(31);                    // '<<'
      break;
    default:
      shift(37);                    // '>>'
    }
    eventHandler.endNonterminal("NodeComp", e0);
  }

  function parse_SimpleMapExpr()
  {
    eventHandler.startNonterminal("SimpleMapExpr", e0);
    parse_PathExpr();
    for (;;)
    {
      if (l1 != 12)                 // '!'
      {
        break;
      }
      shift(12);                    // '!'
      lookahead1W(63);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '.' |
                                    // '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
      whitespace();
      parse_PathExpr();
    }
    eventHandler.endNonterminal("SimpleMapExpr", e0);
  }

  function parse_PathExpr()
  {
    eventHandler.startNonterminal("PathExpr", e0);
    switch (l1)
    {
    case 24:                        // '/'
      shift(24);                    // '/'
      lookahead1W(77);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '!' | '!=' | '$' | '(' |
                                    // '(:' | ')' | '*' | '+' | ',' | '-' | '.' | '..' | '<' | '<<' | '<=' | '=' | '>' |
                                    // '>=' | '>>' | '@' | ']' | 'ancestor' | 'ancestor-or-self' | 'and' | 'attribute' |
                                    // 'cast' | 'castable' | 'child' | 'comment' | 'descendant' | 'descendant-or-self' |
                                    // 'div' | 'document-node' | 'element' | 'eq' | 'except' | 'following' |
                                    // 'following-sibling' | 'ge' | 'gt' | 'idiv' | 'instance' | 'intersect' | 'is' |
                                    // 'le' | 'lt' | 'mod' | 'namespace-node' | 'ne' | 'node' | 'or' | 'parent' |
                                    // 'preceding' | 'preceding-sibling' | 'processing-instruction' | 'self' | 'text' |
                                    // 'to' | 'treat' | 'union' | '{' | '|' | '||'
      switch (l1)
      {
      case 1:                       // IntegerLiteral
      case 2:                       // DecimalLiteral
      case 3:                       // DoubleLiteral
      case 4:                       // StringLiteral
      case 5:                       // URIQualifiedName
      case 7:                       // QName^Token
      case 11:                      // Wildcard
      case 14:                      // '$'
      case 15:                      // '('
      case 22:                      // '.'
      case 23:                      // '..'
      case 39:                      // '@'
      case 42:                      // 'ancestor'
      case 43:                      // 'ancestor-or-self'
      case 47:                      // 'attribute'
      case 50:                      // 'child'
      case 51:                      // 'comment'
      case 54:                      // 'descendant'
      case 55:                      // 'descendant-or-self'
      case 57:                      // 'document-node'
      case 58:                      // 'element'
      case 62:                      // 'following'
      case 63:                      // 'following-sibling'
      case 80:                      // 'namespace-node'
      case 82:                      // 'node'
      case 87:                      // 'parent'
      case 88:                      // 'preceding'
      case 89:                      // 'preceding-sibling'
      case 90:                      // 'processing-instruction'
      case 92:                      // 'self'
      case 95:                      // 'text'
        whitespace();
        parse_RelativePathExpr();
        break;
      default:
        break;
      }
      break;
    case 25:                        // '//'
      shift(25);                    // '//'
      lookahead1W(62);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '.' |
                                    // '..' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' | 'child' |
                                    // 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' | 'element' |
                                    // 'following' | 'following-sibling' | 'namespace-node' | 'node' | 'parent' |
                                    // 'preceding' | 'preceding-sibling' | 'processing-instruction' | 'self' | 'text'
      whitespace();
      parse_RelativePathExpr();
      break;
    default:
      parse_RelativePathExpr();
    }
    eventHandler.endNonterminal("PathExpr", e0);
  }

  function parse_RelativePathExpr()
  {
    eventHandler.startNonterminal("RelativePathExpr", e0);
    parse_StepExpr();
    for (;;)
    {
      if (l1 != 24                  // '/'
       && l1 != 25)                 // '//'
      {
        break;
      }
      switch (l1)
      {
      case 24:                      // '/'
        shift(24);                  // '/'
        break;
      default:
        shift(25);                  // '//'
      }
      lookahead1W(62);              // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '.' |
                                    // '..' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' | 'child' |
                                    // 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' | 'element' |
                                    // 'following' | 'following-sibling' | 'namespace-node' | 'node' | 'parent' |
                                    // 'preceding' | 'preceding-sibling' | 'processing-instruction' | 'self' | 'text'
      whitespace();
      parse_StepExpr();
    }
    eventHandler.endNonterminal("RelativePathExpr", e0);
  }

  function parse_StepExpr()
  {
    eventHandler.startNonterminal("StepExpr", e0);
    switch (l1)
    {
    case 7:                         // QName^Token
      lookahead2W(76);              // S^WS | '!' | '!=' | '(' | '(:' | ')' | '*' | '+' | ',' | '-' | '/' | '//' | '<' |
                                    // '<<' | '<=' | '=' | '=>' | '>' | '>=' | '>>' | '[' | ']' | 'and' | 'cast' |
                                    // 'castable' | 'div' | 'eq' | 'except' | 'ge' | 'gt' | 'idiv' | 'instance' |
                                    // 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' | 'replace' | 'tee' |
                                    // 'to' | 'treat' | 'union' | '{' | '|' | '||' | '→' | '⊤'
      break;
    default:
      lk = l1;
    }
    switch (lk)
    {
    case 1:                         // IntegerLiteral
    case 2:                         // DecimalLiteral
    case 3:                         // DoubleLiteral
    case 4:                         // StringLiteral
    case 14:                        // '$'
    case 15:                        // '('
    case 22:                        // '.'
    case 1927:                      // QName^Token '('
      parse_PostfixExpr();
      break;
    default:
      parse_AxisStep();
    }
    eventHandler.endNonterminal("StepExpr", e0);
  }

  function parse_AxisStep()
  {
    eventHandler.startNonterminal("AxisStep", e0);
    switch (l1)
    {
    case 23:                        // '..'
    case 42:                        // 'ancestor'
    case 43:                        // 'ancestor-or-self'
    case 87:                        // 'parent'
    case 88:                        // 'preceding'
    case 89:                        // 'preceding-sibling'
      parse_ReverseStep();
      break;
    default:
      parse_ForwardStep();
    }
    lookahead1W(75);                // S^WS | '!' | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '/' | '//' | '<' |
                                    // '<<' | '<=' | '=' | '=>' | '>' | '>=' | '>>' | '[' | ']' | 'and' | 'cast' |
                                    // 'castable' | 'div' | 'eq' | 'except' | 'ge' | 'gt' | 'idiv' | 'instance' |
                                    // 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' | 'replace' | 'tee' |
                                    // 'to' | 'treat' | 'union' | '{' | '|' | '||' | '→' | '⊤'
    whitespace();
    parse_PredicateList();
    eventHandler.endNonterminal("AxisStep", e0);
  }

  function parse_ForwardStep()
  {
    eventHandler.startNonterminal("ForwardStep", e0);
    switch (l1)
    {
    case 47:                        // 'attribute'
      lookahead2W(27);              // S^WS | '(' | '(:' | '::'
      break;
    default:
      lk = l1;
    }
    switch (lk)
    {
    case 50:                        // 'child'
    case 54:                        // 'descendant'
    case 55:                        // 'descendant-or-self'
    case 62:                        // 'following'
    case 63:                        // 'following-sibling'
    case 92:                        // 'self'
    case 3503:                      // 'attribute' '::'
      parse_ForwardAxis();
      lookahead1W(54);              // URIQualifiedName | QName^Token | S^WS | Wildcard | '(:' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'namespace-node' | 'node' |
                                    // 'processing-instruction' | 'text'
      whitespace();
      parse_NodeTest();
      break;
    default:
      parse_AbbrevForwardStep();
    }
    eventHandler.endNonterminal("ForwardStep", e0);
  }

  function parse_ForwardAxis()
  {
    eventHandler.startNonterminal("ForwardAxis", e0);
    switch (l1)
    {
    case 50:                        // 'child'
      shift(50);                    // 'child'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 54:                        // 'descendant'
      shift(54);                    // 'descendant'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 47:                        // 'attribute'
      shift(47);                    // 'attribute'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 92:                        // 'self'
      shift(92);                    // 'self'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 55:                        // 'descendant-or-self'
      shift(55);                    // 'descendant-or-self'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 63:                        // 'following-sibling'
      shift(63);                    // 'following-sibling'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    default:
      shift(62);                    // 'following'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
    }
    eventHandler.endNonterminal("ForwardAxis", e0);
  }

  function parse_AbbrevForwardStep()
  {
    eventHandler.startNonterminal("AbbrevForwardStep", e0);
    if (l1 == 39)                   // '@'
    {
      shift(39);                    // '@'
    }
    lookahead1W(54);                // URIQualifiedName | QName^Token | S^WS | Wildcard | '(:' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'namespace-node' | 'node' |
                                    // 'processing-instruction' | 'text'
    whitespace();
    parse_NodeTest();
    eventHandler.endNonterminal("AbbrevForwardStep", e0);
  }

  function parse_ReverseStep()
  {
    eventHandler.startNonterminal("ReverseStep", e0);
    switch (l1)
    {
    case 23:                        // '..'
      parse_AbbrevReverseStep();
      break;
    default:
      parse_ReverseAxis();
      lookahead1W(54);              // URIQualifiedName | QName^Token | S^WS | Wildcard | '(:' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'namespace-node' | 'node' |
                                    // 'processing-instruction' | 'text'
      whitespace();
      parse_NodeTest();
    }
    eventHandler.endNonterminal("ReverseStep", e0);
  }

  function parse_ReverseAxis()
  {
    eventHandler.startNonterminal("ReverseAxis", e0);
    switch (l1)
    {
    case 87:                        // 'parent'
      shift(87);                    // 'parent'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 42:                        // 'ancestor'
      shift(42);                    // 'ancestor'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 89:                        // 'preceding-sibling'
      shift(89);                    // 'preceding-sibling'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    case 88:                        // 'preceding'
      shift(88);                    // 'preceding'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
      break;
    default:
      shift(43);                    // 'ancestor-or-self'
      lookahead1W(9);               // S^WS | '(:' | '::'
      shift(27);                    // '::'
    }
    eventHandler.endNonterminal("ReverseAxis", e0);
  }

  function parse_AbbrevReverseStep()
  {
    eventHandler.startNonterminal("AbbrevReverseStep", e0);
    shift(23);                      // '..'
    eventHandler.endNonterminal("AbbrevReverseStep", e0);
  }

  function parse_NodeTest()
  {
    eventHandler.startNonterminal("NodeTest", e0);
    switch (l1)
    {
    case 5:                         // URIQualifiedName
    case 7:                         // QName^Token
    case 11:                        // Wildcard
      parse_NameTest();
      break;
    default:
      parse_KindTest();
    }
    eventHandler.endNonterminal("NodeTest", e0);
  }

  function parse_NameTest()
  {
    eventHandler.startNonterminal("NameTest", e0);
    switch (l1)
    {
    case 11:                        // Wildcard
      shift(11);                    // Wildcard
      break;
    default:
      parse_EQName();
    }
    eventHandler.endNonterminal("NameTest", e0);
  }

  function parse_PostfixExpr()
  {
    eventHandler.startNonterminal("PostfixExpr", e0);
    parse_PrimaryExpr();
    for (;;)
    {
      lookahead1W(76);              // S^WS | '!' | '!=' | '(' | '(:' | ')' | '*' | '+' | ',' | '-' | '/' | '//' | '<' |
                                    // '<<' | '<=' | '=' | '=>' | '>' | '>=' | '>>' | '[' | ']' | 'and' | 'cast' |
                                    // 'castable' | 'div' | 'eq' | 'except' | 'ge' | 'gt' | 'idiv' | 'instance' |
                                    // 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' | 'replace' | 'tee' |
                                    // 'to' | 'treat' | 'union' | '{' | '|' | '||' | '→' | '⊤'
      if (l1 != 15                  // '('
       && l1 != 40)                 // '['
      {
        break;
      }
      switch (l1)
      {
      case 40:                      // '['
        whitespace();
        parse_Predicate();
        break;
      default:
        whitespace();
        parse_ArgumentList();
      }
    }
    eventHandler.endNonterminal("PostfixExpr", e0);
  }

  function parse_ArgumentList()
  {
    eventHandler.startNonterminal("ArgumentList", e0);
    shift(15);                      // '('
    lookahead1W(71);                // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | ')' | '+' |
                                    // '-' | '.' | '..' | '/' | '//' | '?' | '@' | 'ancestor' | 'ancestor-or-self' |
                                    // 'attribute' | 'child' | 'comment' | 'descendant' | 'descendant-or-self' |
                                    // 'document-node' | 'element' | 'following' | 'following-sibling' |
                                    // 'namespace-node' | 'node' | 'parent' | 'preceding' | 'preceding-sibling' |
                                    // 'processing-instruction' | 'self' | 'text'
    if (l1 != 17)                   // ')'
    {
      whitespace();
      parse_Argument();
      for (;;)
      {
        lookahead1W(28);            // S^WS | '(:' | ')' | ','
        if (l1 != 20)               // ','
        {
          break;
        }
        shift(20);                  // ','
        lookahead1W(69);            // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '?' | '@' | 'ancestor' | 'ancestor-or-self' |
                                    // 'attribute' | 'child' | 'comment' | 'descendant' | 'descendant-or-self' |
                                    // 'document-node' | 'element' | 'following' | 'following-sibling' |
                                    // 'namespace-node' | 'node' | 'parent' | 'preceding' | 'preceding-sibling' |
                                    // 'processing-instruction' | 'self' | 'text'
        whitespace();
        parse_Argument();
      }
    }
    shift(17);                      // ')'
    eventHandler.endNonterminal("ArgumentList", e0);
  }

  function parse_PredicateList()
  {
    eventHandler.startNonterminal("PredicateList", e0);
    for (;;)
    {
      lookahead1W(75);              // S^WS | '!' | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '/' | '//' | '<' |
                                    // '<<' | '<=' | '=' | '=>' | '>' | '>=' | '>>' | '[' | ']' | 'and' | 'cast' |
                                    // 'castable' | 'div' | 'eq' | 'except' | 'ge' | 'gt' | 'idiv' | 'instance' |
                                    // 'intersect' | 'is' | 'le' | 'lt' | 'mod' | 'ne' | 'or' | 'replace' | 'tee' |
                                    // 'to' | 'treat' | 'union' | '{' | '|' | '||' | '→' | '⊤'
      if (l1 != 40)                 // '['
      {
        break;
      }
      whitespace();
      parse_Predicate();
    }
    eventHandler.endNonterminal("PredicateList", e0);
  }

  function parse_Predicate()
  {
    eventHandler.startNonterminal("Predicate", e0);
    shift(40);                      // '['
    lookahead1W(66);                // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | '+' | '-' |
                                    // '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' | 'attribute' |
                                    // 'child' | 'comment' | 'descendant' | 'descendant-or-self' | 'document-node' |
                                    // 'element' | 'following' | 'following-sibling' | 'namespace-node' | 'node' |
                                    // 'parent' | 'preceding' | 'preceding-sibling' | 'processing-instruction' |
                                    // 'self' | 'text'
    whitespace();
    parse_Expr();
    shift(41);                      // ']'
    eventHandler.endNonterminal("Predicate", e0);
  }

  function parse_PrimaryExpr()
  {
    eventHandler.startNonterminal("PrimaryExpr", e0);
    switch (l1)
    {
    case 14:                        // '$'
      lookahead2W(35);              // IntegerLiteral | URIQualifiedName | QName^Token | S^WS | '(:'
      break;
    default:
      lk = l1;
    }
    switch (lk)
    {
    case 654:                       // '$' URIQualifiedName
    case 910:                       // '$' QName^Token
      parse_VarRef();
      break;
    case 142:                       // '$' IntegerLiteral
      parse_XProcInputOrdinal();
      break;
    case 15:                        // '('
      parse_ParenthesizedExpr();
      break;
    case 22:                        // '.'
      parse_ContextItemExpr();
      break;
    case 7:                         // QName^Token
      parse_FunctionCall();
      break;
    default:
      parse_Literal();
    }
    eventHandler.endNonterminal("PrimaryExpr", e0);
  }

  function parse_ParenthesizedExpr()
  {
    eventHandler.startNonterminal("ParenthesizedExpr", e0);
    shift(15);                      // '('
    lookahead1W(68);                // IntegerLiteral | DecimalLiteral | DoubleLiteral | StringLiteral |
                                    // URIQualifiedName | QName^Token | S^WS | Wildcard | '$' | '(' | '(:' | ')' | '+' |
                                    // '-' | '.' | '..' | '/' | '//' | '@' | 'ancestor' | 'ancestor-or-self' |
                                    // 'attribute' | 'child' | 'comment' | 'descendant' | 'descendant-or-self' |
                                    // 'document-node' | 'element' | 'following' | 'following-sibling' |
                                    // 'namespace-node' | 'node' | 'parent' | 'preceding' | 'preceding-sibling' |
                                    // 'processing-instruction' | 'self' | 'text'
    if (l1 != 17)                   // ')'
    {
      whitespace();
      parse_Expr();
    }
    shift(17);                      // ')'
    eventHandler.endNonterminal("ParenthesizedExpr", e0);
  }

  function parse_ContextItemExpr()
  {
    eventHandler.startNonterminal("ContextItemExpr", e0);
    shift(22);                      // '.'
    eventHandler.endNonterminal("ContextItemExpr", e0);
  }

  function parse_FunctionCall()
  {
    eventHandler.startNonterminal("FunctionCall", e0);
    parse_FunctionName();
    lookahead1W(5);                 // S^WS | '(' | '(:'
    whitespace();
    parse_ArgumentList();
    eventHandler.endNonterminal("FunctionCall", e0);
  }

  function parse_Literal()
  {
    eventHandler.startNonterminal("Literal", e0);
    switch (l1)
    {
    case 4:                         // StringLiteral
      shift(4);                     // StringLiteral
      break;
    default:
      parse_NumericLiteral();
    }
    eventHandler.endNonterminal("Literal", e0);
  }

  function parse_NumericLiteral()
  {
    eventHandler.startNonterminal("NumericLiteral", e0);
    switch (l1)
    {
    case 1:                         // IntegerLiteral
      shift(1);                     // IntegerLiteral
      break;
    case 2:                         // DecimalLiteral
      shift(2);                     // DecimalLiteral
      break;
    default:
      shift(3);                     // DoubleLiteral
    }
    eventHandler.endNonterminal("NumericLiteral", e0);
  }

  function parse_VarRef()
  {
    eventHandler.startNonterminal("VarRef", e0);
    shift(14);                      // '$'
    lookahead1W(25);                // URIQualifiedName | QName^Token | S^WS | '(:'
    whitespace();
    parse_VarName();
    eventHandler.endNonterminal("VarRef", e0);
  }

  function parse_VarName()
  {
    eventHandler.startNonterminal("VarName", e0);
    parse_EQName();
    eventHandler.endNonterminal("VarName", e0);
  }

  function parse_Argument()
  {
    eventHandler.startNonterminal("Argument", e0);
    switch (l1)
    {
    case 38:                        // '?'
      parse_ArgumentPlaceholder();
      break;
    default:
      parse_ExprSingle();
    }
    eventHandler.endNonterminal("Argument", e0);
  }

  function parse_ArgumentPlaceholder()
  {
    eventHandler.startNonterminal("ArgumentPlaceholder", e0);
    shift(38);                      // '?'
    eventHandler.endNonterminal("ArgumentPlaceholder", e0);
  }

  function parse_EQName()
  {
    eventHandler.startNonterminal("EQName", e0);
    switch (l1)
    {
    case 7:                         // QName^Token
      parse_QName();
      break;
    default:
      shift(5);                     // URIQualifiedName
    }
    eventHandler.endNonterminal("EQName", e0);
  }

  function parse_SingleType()
  {
    eventHandler.startNonterminal("SingleType", e0);
    parse_SimpleTypeName();
    lookahead1W(72);                // S^WS | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | '<' | '<<' | '<=' | '=' |
                                    // '>' | '>=' | '>>' | '?' | ']' | 'and' | 'castable' | 'div' | 'eq' | 'except' |
                                    // 'ge' | 'gt' | 'idiv' | 'instance' | 'intersect' | 'is' | 'le' | 'lt' | 'mod' |
                                    // 'ne' | 'or' | 'to' | 'treat' | 'union' | '{' | '|' | '||'
    if (l1 == 38)                   // '?'
    {
      shift(38);                    // '?'
    }
    eventHandler.endNonterminal("SingleType", e0);
  }

  function parse_SequenceType()
  {
    eventHandler.startNonterminal("SequenceType", e0);
    parse_ItemType();
    lookahead1W(73);                // S^WS | '!=' | '(:' | ')' | '*' | '+' | ',' | '-' | ':=' | ';' | '<' | '<<' |
                                    // '<=' | '=' | '>' | '>=' | '>>' | '?' | ']' | 'and' | 'div' | 'eq' | 'except' |
                                    // 'ge' | 'gt' | 'idiv' | 'instance' | 'intersect' | 'is' | 'le' | 'lt' | 'mod' |
                                    // 'ne' | 'or' | 'outputs' | 'to' | 'union' | '{' | '|' | '||'
    switch (l1)
    {
    case 18:                        // '*'
    case 19:                        // '+'
    case 38:                        // '?'
      whitespace();
      parse_OccurrenceIndicator();
      break;
    default:
      break;
    }
    eventHandler.endNonterminal("SequenceType", e0);
  }

  function parse_OccurrenceIndicator()
  {
    eventHandler.startNonterminal("OccurrenceIndicator", e0);
    switch (l1)
    {
    case 38:                        // '?'
      shift(38);                    // '?'
      break;
    case 18:                        // '*'
      shift(18);                    // '*'
      break;
    default:
      shift(19);                    // '+'
    }
    eventHandler.endNonterminal("OccurrenceIndicator", e0);
  }

  function parse_ItemType()
  {
    eventHandler.startNonterminal("ItemType", e0);
    switch (l1)
    {
    case 73:                        // 'item'
      shift(73);                    // 'item'
      lookahead1W(5);               // S^WS | '(' | '(:'
      shift(15);                    // '('
      lookahead1W(6);               // S^WS | '(:' | ')'
      shift(17);                    // ')'
      break;
    case 77:                        // 'map'
      parse_MapTest();
      break;
    case 45:                        // 'array'
      parse_ArrayTest();
      break;
    case 5:                         // URIQualifiedName
    case 7:                         // QName^Token
      parse_AtomicOrUnionType();
      break;
    case 15:                        // '('
      parse_ParenthesizedItemType();
      break;
    default:
      parse_KindTest();
    }
    eventHandler.endNonterminal("ItemType", e0);
  }

  function parse_AtomicOrUnionType()
  {
    eventHandler.startNonterminal("AtomicOrUnionType", e0);
    parse_EQName();
    eventHandler.endNonterminal("AtomicOrUnionType", e0);
  }

  function parse_KindTest()
  {
    eventHandler.startNonterminal("KindTest", e0);
    switch (l1)
    {
    case 57:                        // 'document-node'
      parse_DocumentTest();
      break;
    case 58:                        // 'element'
      parse_ElementTest();
      break;
    case 47:                        // 'attribute'
      parse_AttributeTest();
      break;
    case 90:                        // 'processing-instruction'
      parse_PITest();
      break;
    case 51:                        // 'comment'
      parse_CommentTest();
      break;
    case 95:                        // 'text'
      parse_TextTest();
      break;
    case 80:                        // 'namespace-node'
      parse_NamespaceNodeTest();
      break;
    default:
      parse_AnyKindTest();
    }
    eventHandler.endNonterminal("KindTest", e0);
  }

  function parse_AnyKindTest()
  {
    eventHandler.startNonterminal("AnyKindTest", e0);
    shift(82);                      // 'node'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("AnyKindTest", e0);
  }

  function parse_DocumentTest()
  {
    eventHandler.startNonterminal("DocumentTest", e0);
    shift(57);                      // 'document-node'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(30);                // S^WS | '(:' | ')' | 'element'
    if (l1 == 58)                   // 'element'
    {
      whitespace();
      parse_ElementTest();
    }
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("DocumentTest", e0);
  }

  function parse_TextTest()
  {
    eventHandler.startNonterminal("TextTest", e0);
    shift(95);                      // 'text'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("TextTest", e0);
  }

  function parse_CommentTest()
  {
    eventHandler.startNonterminal("CommentTest", e0);
    shift(51);                      // 'comment'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("CommentTest", e0);
  }

  function parse_NamespaceNodeTest()
  {
    eventHandler.startNonterminal("NamespaceNodeTest", e0);
    shift(80);                      // 'namespace-node'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("NamespaceNodeTest", e0);
  }

  function parse_PITest()
  {
    eventHandler.startNonterminal("PITest", e0);
    shift(90);                      // 'processing-instruction'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(36);                // StringLiteral | NCName^Token | S^WS | '(:' | ')'
    if (l1 != 17)                   // ')'
    {
      switch (l1)
      {
      case 6:                       // NCName^Token
        whitespace();
        parse_NCName();
        break;
      default:
        shift(4);                   // StringLiteral
      }
    }
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("PITest", e0);
  }

  function parse_AttributeTest()
  {
    eventHandler.startNonterminal("AttributeTest", e0);
    shift(47);                      // 'attribute'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(45);                // URIQualifiedName | QName^Token | S^WS | '(:' | ')' | '*'
    if (l1 != 17)                   // ')'
    {
      whitespace();
      parse_AttribNameOrWildcard();
      lookahead1W(28);              // S^WS | '(:' | ')' | ','
      if (l1 == 20)                 // ','
      {
        shift(20);                  // ','
        lookahead1W(25);            // URIQualifiedName | QName^Token | S^WS | '(:'
        whitespace();
        parse_TypeName();
      }
    }
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("AttributeTest", e0);
  }

  function parse_AttribNameOrWildcard()
  {
    eventHandler.startNonterminal("AttribNameOrWildcard", e0);
    switch (l1)
    {
    case 18:                        // '*'
      shift(18);                    // '*'
      break;
    default:
      parse_AttributeName();
    }
    eventHandler.endNonterminal("AttribNameOrWildcard", e0);
  }

  function parse_ElementTest()
  {
    eventHandler.startNonterminal("ElementTest", e0);
    shift(58);                      // 'element'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(45);                // URIQualifiedName | QName^Token | S^WS | '(:' | ')' | '*'
    if (l1 != 17)                   // ')'
    {
      whitespace();
      parse_ElementNameOrWildcard();
      lookahead1W(28);              // S^WS | '(:' | ')' | ','
      if (l1 == 20)                 // ','
      {
        shift(20);                  // ','
        lookahead1W(25);            // URIQualifiedName | QName^Token | S^WS | '(:'
        whitespace();
        parse_TypeName();
        lookahead1W(29);            // S^WS | '(:' | ')' | '?'
        if (l1 == 38)               // '?'
        {
          shift(38);                // '?'
        }
      }
    }
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("ElementTest", e0);
  }

  function parse_ElementNameOrWildcard()
  {
    eventHandler.startNonterminal("ElementNameOrWildcard", e0);
    switch (l1)
    {
    case 18:                        // '*'
      shift(18);                    // '*'
      break;
    default:
      parse_ElementName();
    }
    eventHandler.endNonterminal("ElementNameOrWildcard", e0);
  }

  function parse_AttributeName()
  {
    eventHandler.startNonterminal("AttributeName", e0);
    parse_EQName();
    eventHandler.endNonterminal("AttributeName", e0);
  }

  function parse_ElementName()
  {
    eventHandler.startNonterminal("ElementName", e0);
    parse_EQName();
    eventHandler.endNonterminal("ElementName", e0);
  }

  function parse_SimpleTypeName()
  {
    eventHandler.startNonterminal("SimpleTypeName", e0);
    parse_TypeName();
    eventHandler.endNonterminal("SimpleTypeName", e0);
  }

  function parse_TypeName()
  {
    eventHandler.startNonterminal("TypeName", e0);
    parse_EQName();
    eventHandler.endNonterminal("TypeName", e0);
  }

  function parse_MapTest()
  {
    eventHandler.startNonterminal("MapTest", e0);
    switch (l1)
    {
    case 77:                        // 'map'
      lookahead2W(5);               // S^WS | '(' | '(:'
      switch (lk)
      {
      case 1997:                    // 'map' '('
        lookahead3W(39);            // URIQualifiedName | QName^Token | S^WS | '(:' | '*'
        break;
      }
      break;
    default:
      lk = l1;
    }
    switch (lk)
    {
    case 296909:                    // 'map' '(' '*'
      parse_AnyMapTest();
      break;
    default:
      parse_TypedMapTest();
    }
    eventHandler.endNonterminal("MapTest", e0);
  }

  function parse_AnyMapTest()
  {
    eventHandler.startNonterminal("AnyMapTest", e0);
    shift(77);                      // 'map'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(7);                 // S^WS | '(:' | '*'
    shift(18);                      // '*'
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("AnyMapTest", e0);
  }

  function parse_TypedMapTest()
  {
    eventHandler.startNonterminal("TypedMapTest", e0);
    shift(77);                      // 'map'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(25);                // URIQualifiedName | QName^Token | S^WS | '(:'
    whitespace();
    parse_AtomicOrUnionType();
    lookahead1W(8);                 // S^WS | '(:' | ','
    shift(20);                      // ','
    lookahead1W(57);                // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | 'array' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'item' | 'map' | 'namespace-node' |
                                    // 'node' | 'processing-instruction' | 'text'
    whitespace();
    parse_SequenceType();
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("TypedMapTest", e0);
  }

  function parse_ArrayTest()
  {
    eventHandler.startNonterminal("ArrayTest", e0);
    switch (l1)
    {
    case 45:                        // 'array'
      lookahead2W(5);               // S^WS | '(' | '(:'
      switch (lk)
      {
      case 1965:                    // 'array' '('
        lookahead3W(59);            // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | '*' | 'array' |
                                    // 'attribute' | 'comment' | 'document-node' | 'element' | 'item' | 'map' |
                                    // 'namespace-node' | 'node' | 'processing-instruction' | 'text'
        break;
      }
      break;
    default:
      lk = l1;
    }
    switch (lk)
    {
    case 296877:                    // 'array' '(' '*'
      parse_AnyArrayTest();
      break;
    default:
      parse_TypedArrayTest();
    }
    eventHandler.endNonterminal("ArrayTest", e0);
  }

  function parse_AnyArrayTest()
  {
    eventHandler.startNonterminal("AnyArrayTest", e0);
    shift(45);                      // 'array'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(7);                 // S^WS | '(:' | '*'
    shift(18);                      // '*'
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("AnyArrayTest", e0);
  }

  function parse_TypedArrayTest()
  {
    eventHandler.startNonterminal("TypedArrayTest", e0);
    shift(45);                      // 'array'
    lookahead1W(5);                 // S^WS | '(' | '(:'
    shift(15);                      // '('
    lookahead1W(57);                // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | 'array' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'item' | 'map' | 'namespace-node' |
                                    // 'node' | 'processing-instruction' | 'text'
    whitespace();
    parse_SequenceType();
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("TypedArrayTest", e0);
  }

  function parse_ParenthesizedItemType()
  {
    eventHandler.startNonterminal("ParenthesizedItemType", e0);
    shift(15);                      // '('
    lookahead1W(57);                // URIQualifiedName | QName^Token | S^WS | '(' | '(:' | 'array' | 'attribute' |
                                    // 'comment' | 'document-node' | 'element' | 'item' | 'map' | 'namespace-node' |
                                    // 'node' | 'processing-instruction' | 'text'
    whitespace();
    parse_ItemType();
    lookahead1W(6);                 // S^WS | '(:' | ')'
    shift(17);                      // ')'
    eventHandler.endNonterminal("ParenthesizedItemType", e0);
  }

  function parse_QName()
  {
    eventHandler.startNonterminal("QName", e0);
    parse_FunctionName();
    eventHandler.endNonterminal("QName", e0);
  }

  function parse_FunctionName()
  {
    eventHandler.startNonterminal("FunctionName", e0);
    shift(7);                       // QName^Token
    eventHandler.endNonterminal("FunctionName", e0);
  }

  function parse_NCName()
  {
    eventHandler.startNonterminal("NCName", e0);
    shift(6);                       // NCName^Token
    eventHandler.endNonterminal("NCName", e0);
  }

  function try_Whitespace()
  {
    switch (l1)
    {
    case 8:                         // S^WS
      shiftT(8);                    // S^WS
      break;
    default:
      try_Comment();
    }
  }

  function try_Comment()
  {
    shiftT(16);                     // '(:'
    for (;;)
    {
      lookahead1(22);               // CommentContents | '(:' | ':)'
      if (l1 == 26)                 // ':)'
      {
        break;
      }
      switch (l1)
      {
      case 9:                       // CommentContents
        shiftT(9);                  // CommentContents
        break;
      default:
        try_Comment();
      }
    }
    shiftT(26);                     // ':)'
  }

  function shift(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(grammar.TOKEN[l1], b1, e1 > size ? size : e1);
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function shiftT(t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function skip(code)
  {
    var b0W = b0; var e0W = e0; var l1W = l1;
    var b1W = b1; var e1W = e1; var l2W = l2;
    var b2W = b2; var e2W = e2;

    l1 = code; b1 = begin; e1 = end;
    l2 = 0;
    l3 = 0;

    try_Whitespace();

    b0 = b0W; e0 = e0W; l1 = l1W; if (l1 != 0) {
    b1 = b1W; e1 = e1W; l2 = l2W; if (l2 != 0) {
    b2 = b2W; e2 = e2W; }}
  }

  function whitespace()
  {
    if (e0 != b1)
    {
      eventHandler.whitespace(e0, b1);
      e0 = b1;
    }
  }

  function matchW(set)
  {
    var code;
    for (;;)
    {
      code = match(set);
      if (code != 8)                // S^WS
      {
        if (code != 16)             // '(:'
        {
          break;
        }
        skip(code);
      }
    }
    return code;
  }

  function lookahead1W(set)
  {
    if (l1 == 0)
    {
      l1 = matchW(set);
      b1 = begin;
      e1 = end;
    }
  }

  function lookahead2W(set)
  {
    if (l2 == 0)
    {
      l2 = matchW(set);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 7) | l1;
  }

  function lookahead3W(set)
  {
    if (l3 == 0)
    {
      l3 = matchW(set);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 14;
  }

  function lookahead1(set)
  {
    if (l1 == 0)
    {
      l1 = match(set);
      b1 = begin;
      e1 = end;
    }
  }

  function error(b, e, s, l, t)
  {
    throw new self.ParseException(b, e, s, l, t);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var l2, b2, e2;
  var l3, b3, e3;
  var eventHandler;

  var input;
  var size;
  var begin;
  var end;

  function match(tokenSetId)
  {
    var nonbmp = false;
    begin = end;
    var current = end;
    var result = grammar.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 1023; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = grammar.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 4;
        charclass = grammar.MAP1[(c0 & 15) + grammar.MAP1[(c1 & 31) + grammar.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
            nonbmp = true;
          }
        }
        var lo = 0, hi = 5;
        for (var m = 3; ; m = (hi + lo) >> 1)
        {
          if (grammar.MAP2[m] > c0) hi = m - 1;
          else if (grammar.MAP2[6 + m] < c0) lo = m + 1;
          else {charclass = grammar.MAP2[12 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 10) + code - 1;
      code = grammar.TRANSITION[(i0 & 15) + grammar.TRANSITION[i0 >> 4]];

      if (code > 1023)
      {
        result = code;
        code &= 1023;
        end = current;
      }
    }

    result >>= 10;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (nonbmp)
    {
      for (var i = result >> 7; i > 0; --i)
      {
        --end;
        var c1 = end < size ? input.charCodeAt(end) : 0;
        if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      }
    }
    else
    {
      end -= result >> 7;
    }

    return (result & 127) - 1;
  }
}

grammar.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : grammar.INITIAL[tokenSetId] & 1023;
  for (var i = 0; i < 109; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 603 + s - 1;
    var i1 = i0 >> 2;
    var f = grammar.EXPECTED[(i0 & 3) + grammar.EXPECTED[(i1 & 7) + grammar.EXPECTED[i1 >> 3]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(grammar.TOKEN[j]);
      }
    }
  }
  return set;
};

grammar.MAP0 =
[
  /*   0 */ 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4,
  /*  36 */ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 19, 20, 21, 22, 23,
  /*  64 */ 24, 25, 25, 25, 25, 26, 25, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 27, 27, 27, 27, 27, 27, 27, 27, 27,
  /*  91 */ 29, 6, 30, 6, 27, 6, 31, 32, 33, 34, 35, 36, 37, 38, 39, 27, 27, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  /* 119 */ 51, 52, 53, 27, 54, 55, 56, 6, 6
];

grammar.MAP1 =
[
  /*   0 */ 108, 124, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 156, 182, 193, 193, 193,
  /*  21 */ 193, 226, 227, 225, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226,
  /*  42 */ 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226,
  /*  63 */ 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226,
  /*  84 */ 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226, 226,
  /* 105 */ 226, 226, 226, 259, 273, 289, 305, 321, 359, 375, 391, 413, 413, 413, 405, 343, 335, 343, 335, 343, 343,
  /* 126 */ 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 430, 430, 430, 430, 430, 430, 430,
  /* 147 */ 328, 343, 343, 343, 343, 343, 343, 343, 343, 450, 413, 413, 414, 412, 413, 413, 343, 343, 343, 343, 343,
  /* 168 */ 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 446, 413, 413, 413, 413, 413, 413, 471,
  /* 189 */ 413, 413, 413, 466, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413,
  /* 210 */ 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 413, 342, 343, 343, 343, 343, 343,
  /* 231 */ 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343, 343,
  /* 252 */ 343, 343, 343, 343, 343, 343, 413, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 283 */ 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17,
  /* 314 */ 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 25, 25, 26, 25, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
  /* 341 */ 27, 6, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 27, 27, 27, 27, 27, 27, 27,
  /* 368 */ 27, 27, 29, 6, 30, 6, 27, 6, 31, 32, 33, 34, 35, 36, 37, 38, 39, 27, 27, 40, 41, 42, 43, 44, 45, 46, 47, 48,
  /* 396 */ 49, 50, 51, 52, 53, 27, 54, 55, 56, 6, 6, 6, 6, 6, 6, 6, 57, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  /* 429 */ 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 6, 6, 58, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  /* 459 */ 6, 6, 6, 27, 27, 6, 6, 6, 6, 6, 6, 60, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 59, 6, 6, 6, 6
];

grammar.MAP2 =
[
  /*  0 */ 57344, 63744, 64976, 65008, 65536, 983040, 63743, 64975, 65007, 65533, 983039, 1114111, 6, 27, 6, 27, 27, 6
];

grammar.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  /* 29 */ 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  /* 56 */ 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78
];

grammar.TRANSITION =
[
  /*     0 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*    17 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*    34 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*    51 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 3975, 3968, 3975, 3975,
  /*    68 */ 3976, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*    85 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   102 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   119 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 4027, 4067, 3992, 8876, 8877,
  /*   136 */ 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   153 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   170 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   187 */ 8877, 8877, 8877, 8877, 8877, 6441, 6434, 6332, 4109, 4125, 4171, 8876, 8877, 8877, 8877, 8877, 9751,
  /*   204 */ 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   221 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   238 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   255 */ 8877, 8877, 8870, 8877, 8877, 8877, 3992, 8876, 8877, 8877, 8877, 8877, 7082, 9769, 8877, 8877, 8877,
  /*   272 */ 8877, 10592, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   289 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   306 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8579, 4732, 6058,
  /*   323 */ 4214, 4230, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   340 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   357 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   374 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 8877, 8877, 3992, 8876,
  /*   391 */ 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   408 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   425 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   442 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 8877, 8877, 4302, 8876, 8877, 8877, 8877, 8877,
  /*   459 */ 5715, 4975, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   476 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   493 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   510 */ 8877, 8877, 5114, 5107, 6421, 4360, 4376, 4424, 8876, 8877, 8877, 8877, 8877, 4093, 9769, 8877, 8877,
  /*   527 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   544 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   561 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 4466, 4476,
  /*   578 */ 4455, 4492, 4508, 4548, 4563, 8877, 8877, 8877, 8877, 8423, 9769, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   595 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   612 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   629 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5814, 6071, 9059, 5813, 6084, 3992,
  /*   646 */ 4580, 8877, 8877, 8877, 8877, 4155, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   663 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   680 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   697 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 4967, 8870, 9214, 4652, 4598, 3992, 8876, 8877, 8877, 8877,
  /*   714 */ 8877, 5684, 6714, 8877, 8877, 8877, 8877, 4011, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   731 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   748 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   765 */ 8877, 8877, 8877, 8877, 8870, 8877, 8877, 4638, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877,
  /*   782 */ 5070, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   799 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   816 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 4343,
  /*   833 */ 10605, 4582, 4344, 4668, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877,
  /*   850 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   867 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   884 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 8877, 4705,
  /*   901 */ 4759, 4186, 4843, 8124, 8877, 4808, 8286, 5745, 10166, 4834, 8480, 6173, 4051, 10163, 4852, 4390, 8877,
  /*   918 */ 4877, 10167, 6162, 7348, 10153, 8258, 6169, 10160, 10739, 10735, 4904, 4941, 4991, 5891, 9023, 4332, 8877,
  /*   935 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*   952 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 7350, 5045, 4759, 4186, 4843, 9090,
  /*   969 */ 8877, 4808, 8286, 5745, 10166, 5011, 8480, 6173, 4051, 10163, 4852, 4390, 8877, 4877, 10167, 6162, 7348,
  /*   986 */ 10153, 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877,
  /*  1003 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1020 */ 8877, 8877, 8877, 8877, 8877, 8870, 8877, 5292, 5094, 3992, 8876, 4682, 8877, 8877, 8877, 5684, 9769,
  /*  1037 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1054 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1071 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1088 */ 9185, 7245, 9182, 5116, 5132, 5171, 4186, 4843, 6586, 8877, 4808, 8286, 5745, 10166, 5225, 8480, 4532,
  /*  1105 */ 4051, 10163, 9109, 4522, 5251, 5308, 10167, 6162, 10649, 5335, 8258, 6967, 5362, 10739, 10735, 4888, 9342,
  /*  1122 */ 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1139 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5155, 4081, 5384, 8877,
  /*  1156 */ 5599, 5402, 5418, 5491, 5452, 8877, 10276, 5537, 5629, 8742, 5482, 6213, 5535, 8684, 8739, 5514, 4139,
  /*  1173 */ 8877, 7695, 8743, 5524, 4152, 8729, 5498, 5531, 8736, 5436, 5432, 7706, 5466, 5462, 5553, 5563, 5579,
  /*  1190 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1207 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 6107, 8870, 4743, 8877, 6109, 3992, 8876, 8877,
  /*  1224 */ 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8878, 8674, 8877, 8877, 8877,
  /*  1241 */ 5615, 6876, 8877, 6265, 6883, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1258 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1275 */ 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 8877, 5645, 3992, 8876, 8877, 8877, 5681, 8877, 5684,
  /*  1292 */ 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1309 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1326 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1343 */ 8877, 5665, 8870, 5712, 5700, 5731, 5772, 8876, 8877, 8877, 5830, 8877, 5684, 9769, 8877, 8877, 8877,
  /*  1360 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1377 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1394 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877,
  /*  1411 */ 10090, 5849, 3992, 4007, 8877, 9388, 9390, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1428 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1445 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1462 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 6345, 8877, 8877, 6203, 3992, 8876,
  /*  1479 */ 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1496 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1513 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1530 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 4719, 9187, 5907, 3992, 8876, 8877, 8877, 8877, 8877,
  /*  1547 */ 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1564 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1581 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1598 */ 8877, 8877, 5957, 8523, 5977, 6007, 6044, 4759, 4186, 4843, 8124, 8877, 4808, 9829, 5863, 10166, 5011,
  /*  1615 */ 8480, 6173, 7670, 10163, 4852, 4390, 6100, 4877, 10167, 6162, 7684, 6125, 8258, 6967, 5362, 10739, 10735,
  /*  1632 */ 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1649 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523,
  /*  1666 */ 5977, 6007, 6044, 4759, 4186, 4843, 10197, 8877, 4808, 9829, 5863, 10166, 6152, 8480, 6173, 7670, 10163,
  /*  1683 */ 4852, 4390, 6100, 4877, 10167, 6162, 7684, 6125, 8258, 6967, 5362, 10739, 10735, 4888, 9342, 9338, 6658,
  /*  1700 */ 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1717 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6007, 6044, 4759,
  /*  1734 */ 4186, 4843, 8124, 8877, 4808, 9829, 5863, 10166, 5011, 8480, 6173, 7670, 10163, 4852, 4390, 8877, 4877,
  /*  1751 */ 10167, 6162, 7348, 10153, 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877,
  /*  1768 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1785 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 4041, 6189, 6229, 6245, 4759, 4186, 4843, 8124, 8877,
  /*  1802 */ 4808, 9829, 5863, 10166, 5011, 8480, 6173, 7670, 10163, 4852, 4390, 8877, 4877, 10167, 6162, 7348, 10153,
  /*  1819 */ 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1836 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1853 */ 8877, 8877, 8877, 8877, 8870, 10660, 6281, 4925, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877,
  /*  1870 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1887 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1904 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5961,
  /*  1921 */ 4270, 8877, 4278, 6318, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877,
  /*  1938 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1955 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  1972 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 6361, 8523, 6375, 6391, 6407,
  /*  1989 */ 6459, 4186, 6528, 7543, 8877, 6516, 7895, 5863, 10166, 5011, 8480, 5235, 10635, 9100, 4852, 7589, 6100,
  /*  2006 */ 6544, 7502, 4622, 7684, 6125, 8258, 9252, 6571, 10739, 7882, 4888, 9342, 9338, 6658, 9023, 4332, 8877,
  /*  2023 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2040 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6007, 6044, 4759, 4186, 4843, 8124,
  /*  2057 */ 8877, 4808, 9829, 5863, 10166, 5011, 8480, 6173, 7670, 10163, 4852, 4390, 6100, 4877, 10167, 6162, 7684,
  /*  2074 */ 6622, 6650, 7232, 5362, 10739, 10735, 4888, 9342, 9338, 6018, 9023, 4332, 8877, 8877, 8877, 8877, 8877,
  /*  2091 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2108 */ 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6674, 6690, 4759, 4186, 4843, 8124, 8877, 4808, 9829, 5921,
  /*  2125 */ 7395, 10400, 6730, 6173, 7670, 6758, 5029, 4390, 6100, 4877, 7442, 6162, 7684, 6746, 7640, 8510, 5362,
  /*  2142 */ 8082, 6774, 4888, 9342, 9338, 6658, 9023, 6790, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2159 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2176 */ 6817, 8523, 6830, 6846, 6862, 4759, 4186, 4843, 8124, 6801, 6902, 9829, 5863, 6931, 6606, 9631, 8404,
  /*  2193 */ 7670, 10163, 4852, 4390, 6100, 4877, 10167, 6960, 7684, 6125, 9301, 6967, 5362, 8039, 10735, 4888, 9342,
  /*  2210 */ 7764, 6983, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2227 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 7009, 5977, 7052,
  /*  2244 */ 7068, 7098, 5186, 5874, 7143, 5059, 7159, 8454, 7175, 5199, 7217, 7201, 8920, 7269, 8224, 7319, 7335,
  /*  2261 */ 6100, 7366, 8818, 9245, 7684, 7382, 7411, 6967, 7435, 7458, 7824, 7488, 9342, 4818, 7518, 6993, 4332,
  /*  2278 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2295 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 7559, 7575, 7605, 4774, 4843,
  /*  2312 */ 7621, 8877, 4808, 10454, 5863, 10166, 5011, 8480, 6173, 7670, 10163, 4408, 4390, 6100, 4877, 10167, 6162,
  /*  2329 */ 7684, 6125, 8258, 6967, 5362, 10739, 10735, 4888, 9342, 9338, 6658, 8946, 7190, 8877, 8877, 8877, 8877,
  /*  2346 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2363 */ 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6007, 7656, 4759, 4186, 4843, 8124, 8877, 4808, 6915,
  /*  2380 */ 5863, 10166, 5011, 8480, 6173, 10721, 10163, 4852, 4390, 8877, 4877, 10167, 6162, 7348, 10153, 8258, 6169,
  /*  2397 */ 10160, 10739, 10735, 6555, 9332, 9338, 6658, 9029, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2414 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2431 */ 8877, 5957, 8523, 5977, 6007, 6044, 7722, 4186, 4843, 8907, 8877, 7738, 9829, 5863, 10166, 5011, 8480,
  /*  2448 */ 6173, 7670, 10163, 4852, 4390, 8877, 4877, 10167, 6162, 7348, 10153, 8258, 6169, 10160, 10739, 10735,
  /*  2464 */ 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2481 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523,
  /*  2498 */ 7780, 7810, 7840, 4759, 4186, 4843, 8124, 8418, 7911, 9829, 5863, 10166, 10319, 7954, 7998, 7854, 10163,
  /*  2515 */ 4852, 4390, 10691, 8055, 8069, 6162, 7348, 10153, 8258, 6169, 10160, 7938, 9283, 4888, 9342, 6136, 6658,
  /*  2532 */ 9017, 5802, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2549 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 8098, 8150, 8194,
  /*  2566 */ 7113, 8112, 8210, 8877, 8240, 6915, 5863, 10166, 10218, 8480, 6173, 10769, 10163, 8274, 4612, 8877, 4877,
  /*  2583 */ 10167, 6162, 4918, 10153, 8258, 6169, 10160, 8344, 10735, 4888, 9342, 9338, 9569, 8302, 4332, 8877, 8877,
  /*  2600 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2617 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 8332, 8360, 4759, 4186, 4843, 8390, 8877,
  /*  2634 */ 4808, 7036, 5991, 7531, 5011, 8480, 9151, 8374, 8774, 4852, 4390, 4564, 8439, 7925, 6162, 7348, 10153,
  /*  2651 */ 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2668 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2685 */ 8877, 8877, 8877, 5957, 8470, 8496, 8549, 8565, 4759, 6474, 4843, 8600, 10532, 8645, 8178, 5863, 10166,
  /*  2702 */ 5011, 8480, 6173, 8700, 10163, 4852, 4390, 8877, 4877, 10167, 7751, 9529, 8759, 8803, 8858, 8894, 10739,
  /*  2719 */ 7868, 4198, 8316, 8134, 8936, 6028, 4956, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2736 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957,
  /*  2753 */ 8962, 8988, 9004, 9045, 4759, 4186, 9075, 8787, 8533, 9125, 9456, 5863, 8615, 5209, 8480, 6173, 7670,
  /*  2770 */ 10163, 9141, 9167, 9203, 9230, 10167, 10783, 9705, 9268, 8258, 6169, 10160, 9317, 10735, 4888, 8026, 8842,
  /*  2787 */ 6658, 9023, 5281, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2804 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 9358, 9374,
  /*  2821 */ 4759, 4317, 4399, 9406, 8877, 4808, 9829, 9441, 5368, 9472, 9997, 9482, 8012, 6596, 4852, 4390, 9498,
  /*  2838 */ 9514, 10167, 5346, 4258, 9545, 9561, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877,
  /*  2855 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2872 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6007, 6044, 4759, 4186, 4843, 8124,
  /*  2889 */ 6259, 9585, 9644, 5863, 10166, 5011, 8480, 6173, 5266, 10163, 4852, 4390, 8877, 4877, 10167, 6162, 7348,
  /*  2906 */ 10153, 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877,
  /*  2923 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2940 */ 8877, 8877, 8877, 8877, 5957, 8523, 5977, 9601, 9617, 4759, 4186, 6634, 6944, 6302, 9660, 9676, 5863,
  /*  2957 */ 4787, 9692, 8480, 6173, 7794, 5001, 4852, 4390, 8877, 4877, 7472, 10055, 7348, 10153, 5883, 6169, 10160,
  /*  2974 */ 10739, 7968, 4888, 9425, 9338, 8830, 10246, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  2991 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3008 */ 5957, 8523, 5977, 9721, 9737, 9785, 4186, 4843, 8124, 6500, 9801, 10357, 5863, 10166, 9817, 4244, 8660,
  /*  3025 */ 9845, 10163, 4852, 4390, 5941, 4877, 9861, 6162, 5935, 9877, 9893, 9909, 9925, 10739, 10735, 4888, 9342,
  /*  3042 */ 9421, 9941, 7297, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3059 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 9987, 5977, 9957,
  /*  3076 */ 9973, 4759, 4439, 4861, 8629, 5146, 10013, 9829, 10029, 7634, 5011, 10562, 8715, 7670, 10208, 10045, 7024,
  /*  3093 */ 8877, 10071, 7283, 10410, 10087, 10106, 10122, 10138, 10183, 10801, 10797, 5319, 7982, 9338, 7419, 10234,
  /*  3109 */ 6489, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3126 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6007, 10262, 4759, 5787,
  /*  3143 */ 5020, 8124, 8877, 10292, 9829, 5863, 10166, 5011, 8480, 10329, 8164, 10308, 10345, 4390, 4689, 10373,
  /*  3159 */ 8254, 6162, 7348, 10153, 8258, 6169, 10389, 10739, 10735, 4888, 9342, 9338, 6658, 7303, 4332, 8877, 8877,
  /*  3176 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3193 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 6704, 5977, 6007, 6044, 4759, 4186, 4843, 8124, 8877,
  /*  3210 */ 4808, 9829, 5863, 10166, 5011, 10426, 6173, 7670, 10163, 4852, 10442, 8877, 4877, 10167, 6162, 7348,
  /*  3226 */ 10153, 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877,
  /*  3243 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3260 */ 8877, 8877, 8877, 8877, 5957, 8523, 5977, 6007, 6044, 4759, 4186, 4843, 8124, 8877, 4808, 9829, 5863,
  /*  3277 */ 10166, 5011, 8480, 6173, 7670, 10163, 4852, 4390, 8877, 4877, 10167, 6162, 7348, 10153, 4792, 6169, 10160,
  /*  3294 */ 10739, 10735, 4888, 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3311 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3328 */ 5957, 8523, 5977, 10470, 6044, 4759, 4186, 4843, 8124, 5659, 10486, 9829, 5863, 7127, 5011, 8972, 5756,
  /*  3345 */ 7670, 10163, 4852, 4390, 6443, 10502, 10167, 6162, 7348, 10153, 8258, 6169, 10160, 10739, 10735, 4888,
  /*  3361 */ 9342, 9338, 6658, 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3378 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 5957, 8523, 5977,
  /*  3395 */ 6007, 6044, 4759, 4186, 4843, 8124, 8877, 4808, 9829, 5863, 10166, 5011, 8480, 6173, 7670, 10163, 4852,
  /*  3412 */ 4390, 8877, 4877, 9297, 6162, 7348, 10153, 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658, 9023,
  /*  3429 */ 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3446 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 6295, 5590, 10518, 10548, 3992, 9765,
  /*  3463 */ 8877, 8877, 8877, 8877, 6886, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3480 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3497 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3514 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 8877, 10578, 3992, 8876, 8877, 8877, 5386, 8877,
  /*  3531 */ 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3548 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3565 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3582 */ 8877, 8877, 8877, 8870, 8877, 10621, 8877, 3992, 8876, 8877, 8877, 8877, 8877, 5833, 5078, 8877, 8877,
  /*  3599 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3616 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3633 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870,
  /*  3650 */ 8877, 8877, 8877, 4759, 4186, 4843, 8124, 8877, 4808, 8286, 5745, 10166, 5011, 8480, 6173, 4051, 10163,
  /*  3667 */ 4852, 4390, 8877, 4877, 10167, 6162, 7348, 10153, 8258, 6169, 10160, 10739, 10735, 4888, 9342, 9338, 6658,
  /*  3684 */ 9023, 4332, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3701 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 10688, 10676, 7253, 3992,
  /*  3718 */ 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3735 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3752 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3769 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8870, 8877, 8584, 8877, 3992, 8876, 8877, 8877, 8877,
  /*  3786 */ 8877, 5684, 9769, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3803 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3820 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3837 */ 8877, 8877, 8877, 8877, 8870, 8877, 10707, 4286, 3992, 8876, 8877, 8877, 8877, 8877, 5684, 9769, 8877,
  /*  3854 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3871 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3888 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3905 */ 8877, 8877, 10755, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3922 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3939 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877,
  /*  3956 */ 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 8877, 9295, 9295, 9295, 9295, 9295,
  /*  3973 */ 9295, 95, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295, 9295,
  /*  3991 */ 0, 0, 82, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 0, 0, 35840, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  4024 */ 12288, 0, 0, 13312, 0, 0, 0, 0, 0, 0, 13312, 0, 0, 0, 0, 0, 13312, 0, 0, 0, 0, 0, 0, 95, 8277, 0, 8290, 0,
  /*  4052 */ 0, 0, 0, 0, 0, 0, 0, 0, 8277, 8277, 12572, 0, 0, 8302, 8302, 145, 145, 0, 145, 0, 0, 145, 0, 145, 145,
  /*  4077 */ 13312, 13457, 13457, 13457, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 83, 0, 0, 0, 0, 0, 0,
  /*  4106 */ 95, 95, 192, 0, 82, 82, 82, 82, 82, 0, 0, 82, 0, 82, 0, 82, 82, 82, 82, 0, 0, 82, 0, 82, 82, 0, 82, 0, 0,
  /*  4135 */ 82, 0, 0, 82, 0, 0, 0, 0, 0, 0, 202, 0, 202, 202, 202, 202, 202, 202, 202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  4164 */ 0, 0, 0, 0, 95, 0, 192, 0, 5300, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 8277, 0, 0, 0, 0, 0, 0,
  /*  4194 */ 8277, 8277, 8277, 8277, 0, 8302, 8302, 8302, 8722, 8277, 8277, 8277, 8725, 8302, 8727, 8302, 8302, 0,
  /*  4212 */ 8302, 8730, 0, 15360, 15360, 15360, 15360, 15360, 0, 0, 15360, 0, 15360, 0, 15360, 15360, 15360, 15360, 0,
  /*  4231 */ 0, 15360, 0, 15360, 15360, 0, 15360, 0, 0, 15360, 0, 0, 15360, 0, 0, 0, 0, 0, 0, 324, 0, 326, 8302, 8302,
  /*  4255 */ 328, 8302, 8521, 8302, 8302, 0, 0, 0, 0, 0, 459, 0, 0, 0, 414, 0, 0, 0, 0, 0, 0, 95, 0, 0, 0, 0, 0, 0, 0,
  /*  4284 */ 0, 43008, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111616, 111616, 111616, 0, 0, 0, 0, 181, 182, 0, 0, 0, 0, 0, 0, 0,
  /*  4312 */ 0, 0, 0, 0, 95, 95, 8277, 0, 0, 0, 0, 0, 0, 8277, 8277, 8277, 8392, 0, 8302, 8302, 8302, 8277, 8302, 8302,
  /*  4336 */ 8277, 8302, 8277, 8302, 8277, 8302, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 21504, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83,
  /*  4362 */ 83, 83, 83, 83, 0, 0, 83, 0, 83, 0, 83, 83, 83, 83, 0, 0, 83, 0, 83, 83, 0, 83, 0, 0, 83, 0, 0, 83, 0, 0,
  /*  4392 */ 0, 0, 0, 0, 8302, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 8392, 8277, 8277, 8277, 8277, 8277,
  /*  4412 */ 8277, 8277, 8277, 0, 8302, 8302, 8302, 8302, 8302, 8302, 95342, 0, 0, 82, 5303, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  4436 */ 0, 0, 95, 95, 8277, 0, 0, 0, 0, 0, 0, 8277, 8277, 8391, 8277, 0, 8302, 8302, 8396, 80, 80, 80, 80, 80,
  /*  4460 */ 16464, 80, 80, 80, 80, 16464, 80, 80, 80, 80, 80, 16464, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 96, 80,
  /*  4484 */ 80, 80, 80, 16464, 80, 80, 80, 80, 80, 16464, 16464, 16464, 16464, 16464, 80, 80, 16464, 16464, 16464,
  /*  4503 */ 16464, 16464, 16464, 16464, 16464, 80, 80, 16464, 80, 16464, 16464, 80, 16464, 80, 80, 16464, 80, 16464,
  /*  4521 */ 16464, 0, 0, 0, 0, 0, 0, 8302, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 336, 0, 0, 0, 342, 0, 0, 0,
  /*  4545 */ 8462, 0, 0, 0, 82, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141502, 141502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  4575 */ 0, 0, 0, 0, 412, 27648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21504, 21504, 19456, 19456, 12397,
  /*  4601 */ 19456, 12397, 12397, 19456, 12397, 19456, 19456, 12397, 19456, 19456, 12397, 0, 0, 0, 0, 0, 0, 8588, 0,
  /*  4620 */ 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 451, 0, 452, 8645, 8646, 8302, 8648, 8302, 20480,
  /*  4639 */ 20480, 20480, 20480, 20480, 20480, 20480, 20480, 20480, 20480, 0, 20480, 20480, 20480, 0, 0, 0, 0, 0, 0,
  /*  4658 */ 12397, 0, 0, 0, 0, 19456, 0, 0, 12397, 12397, 21504, 21504, 0, 21504, 0, 0, 21504, 0, 21504, 21504, 21504,
  /*  4679 */ 21504, 21504, 21504, 0, 0, 0, 0, 0, 0, 26624, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 407, 0, 0, 0, 0, 22528,
  /*  4706 */ 22528, 22528, 22528, 22528, 22528, 22528, 22528, 22528, 22528, 0, 22528, 22528, 22528, 0, 0, 0, 0, 0, 0,
  /*  4725 */ 40960, 0, 0, 0, 0, 40960, 40960, 0, 0, 0, 0, 0, 0, 95, 0, 15360, 0, 15360, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  4752 */ 30720, 0, 0, 0, 0, 30720, 30720, 0, 82, 83, 7252, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 8277, 0, 0, 0,
  /*  4779 */ 0, 0, 0, 69717, 8277, 8277, 8277, 0, 8302, 8302, 8302, 8277, 8488, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  4798 */ 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8677, 8302, 8302, 0, 0, 0, 8302, 8302, 0, 0, 8302, 8302, 8302,
  /*  4818 */ 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 59502, 8302, 8302, 8277,
  /*  4835 */ 8277, 8277, 8277, 8277, 8277, 0, 312, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 8277, 8277, 8277, 8277,
  /*  4854 */ 8277, 8277, 8277, 8277, 8277, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 8277, 8406, 8277, 8277,
  /*  4872 */ 8277, 8410, 8277, 8277, 8277, 0, 0, 6499, 0, 0, 0, 0, 8277, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8277,
  /*  4894 */ 8277, 8277, 8277, 8302, 8302, 8302, 8302, 0, 8302, 8302, 0, 8302, 8720, 8302, 8302, 8277, 8723, 8277,
  /*  4912 */ 8277, 8726, 8302, 8302, 8302, 0, 8302, 8302, 0, 0, 0, 0, 458, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41984,
  /*  4937 */ 41984, 0, 0, 0, 8731, 8302, 8277, 8734, 8277, 8302, 8302, 8738, 8739, 8302, 8302, 8742, 8277, 8277, 8745,
  /*  4956 */ 8302, 8277, 8302, 8302, 8277, 8302, 8277, 8302, 8277, 93294, 93269, 0, 0, 0, 0, 0, 0, 0, 19456, 0, 0, 0,
  /*  4978 */ 0, 0, 0, 0, 0, 0, 0, 285, 0, 0, 0, 0, 0, 8747, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8756, 8302,
  /*  5002 */ 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8565, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 0, 0, 8302,
  /*  5020 */ 8302, 8302, 8302, 8302, 8302, 8302, 0, 8404, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 0, 8302,
  /*  5038 */ 8302, 8578, 8302, 8302, 8581, 8302, 0, 0, 0, 23689, 0, 23689, 23689, 0, 23689, 0, 0, 23689, 0, 0, 23689,
  /*  5059 */ 0, 0, 0, 0, 0, 0, 66560, 0, 76800, 0, 83968, 0, 0, 0, 0, 0, 0, 0, 312, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 286,
  /*  5089 */ 0, 0, 0, 0, 0, 0, 0, 25719, 0, 25719, 25719, 0, 25719, 0, 0, 0, 25719, 25719, 0, 0, 0, 0, 0, 0, 95, 0, 83,
  /*  5116 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2186, 2186, 0, 0, 2186, 0, 2186, 2186, 0, 2186, 0, 0, 2186, 0,
  /*  5144 */ 0, 2186, 0, 0, 0, 0, 0, 0, 67584, 0, 78848, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 87, 0, 0, 0, 0, 0, 2129, 82,
  /*  5173 */ 83, 7252, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 8277, 0, 0, 0, 0, 196, 197, 8277, 8390, 8277, 8277, 0,
  /*  5199 */ 8302, 8302, 8302, 8277, 8277, 8277, 8277, 8277, 8492, 8493, 8277, 8277, 8277, 8277, 8277, 8277, 0, 0,
  /*  5217 */ 8302, 8302, 8302, 8302, 8302, 8485, 8302, 0, 8277, 8277, 8277, 8277, 8277, 8277, 3303, 4408, 8302, 8302,
  /*  5235 */ 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 8462, 348, 0, 403, 0, 0, 0, 0, 342, 405, 0, 0, 0, 0,
  /*  5262 */ 0, 0, 0, 410, 0, 0, 0, 354, 6499, 0, 0, 0, 0, 8277, 8277, 12572, 364, 6499, 8302, 8302, 8277, 8302, 8302,
  /*  5285 */ 8277, 8302, 8277, 8794, 8795, 8302, 8277, 0, 0, 0, 0, 0, 0, 0, 25719, 0, 0, 0, 0, 0, 0, 0, 25719, 0, 0,
  /*  5310 */ 6499, 0, 0, 0, 0, 8277, 421, 0, 0, 0, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8277, 8302, 8302, 8302,
  /*  5331 */ 8302, 73728, 73838, 8302, 0, 0, 0, 8277, 421, 466, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8302, 8302, 449, 0,
  /*  5353 */ 0, 0, 0, 0, 8302, 8302, 8647, 8302, 8302, 0, 466, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8277,
  /*  5374 */ 8277, 8277, 8277, 8277, 79957, 8277, 8277, 8277, 8277, 8277, 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  5399 */ 0, 107520, 0, 0, 82, 83, 0, 184, 28672, 0, 0, 0, 0, 0, 0, 0, 0, 141503, 17408, 141503, 184, 0, 0, 0, 0, 0,
  /*  5425 */ 0, 184, 184, 184, 184, 201, 202, 202, 202, 184, 184, 184, 184, 202, 202, 202, 202, 0, 0, 0, 202, 202, 202,
  /*  5448 */ 202, 0, 202, 202, 184, 184, 184, 184, 0, 184, 184, 184, 0, 0, 202, 202, 202, 202, 202, 202, 184, 184, 184,
  /*  5471 */ 202, 202, 202, 202, 202, 202, 202, 184, 184, 184, 202, 184, 184, 184, 184, 184, 184, 0, 0, 202, 202, 202,
  /*  5493 */ 202, 202, 202, 202, 0, 184, 184, 184, 184, 184, 184, 184, 184, 184, 184, 184, 202, 202, 202, 202, 202,
  /*  5514 */ 184, 184, 184, 184, 184, 184, 184, 0, 202, 202, 202, 202, 202, 202, 202, 0, 0, 0, 0, 0, 0, 202, 202, 202,
  /*  5538 */ 202, 202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141503, 192, 184, 184, 184, 202, 202, 202, 202, 202, 202, 184,
  /*  5563 */ 184, 202, 202, 202, 202, 202, 184, 202, 202, 202, 202, 202, 184, 202, 202, 202, 202, 184, 202, 202, 184,
  /*  5584 */ 202, 184, 202, 184, 202, 184, 0, 0, 0, 0, 0, 0, 0, 0, 105472, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 0, 0, 0, 0,
  /*  5613 */ 0, 17408, 0, 0, 82, 0, 83, 0, 0, 0, 0, 192, 0, 0, 0, 192, 0, 0, 0, 0, 0, 184, 184, 184, 0, 0, 203, 202,
  /*  5641 */ 202, 202, 202, 202, 31890, 31890, 0, 31890, 0, 0, 31890, 0, 31890, 31890, 0, 31890, 31890, 31890, 0, 0, 0,
  /*  5662 */ 0, 0, 242, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34816, 0, 0, 0, 0, 32768, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  5694 */ 0, 0, 0, 95, 95, 192, 100, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  5726 */ 0, 0, 95, 95, 276, 34816, 34816, 0, 34816, 0, 0, 34816, 0, 34816, 34816, 100, 34916, 34916, 34816, 0, 0,
  /*  5747 */ 0, 0, 0, 8277, 8277, 8277, 0, 0, 203, 8302, 8302, 8302, 8302, 8302, 337, 0, 0, 0, 343, 0, 0, 0, 8462, 0,
  /*  5771 */ 0, 0, 82, 83, 0, 0, 0, 29696, 0, 0, 0, 0, 0, 0, 0, 95, 95, 8277, 0, 0, 0, 195, 0, 0, 8277, 8277, 8277,
  /*  5798 */ 8277, 0, 8302, 8302, 8302, 8277, 8302, 8302, 8277, 8792, 8793, 8302, 8277, 8302, 8277, 0, 0, 0, 0, 0, 0,
  /*  5819 */ 0, 18432, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14336, 33792, 37888, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95,
  /*  5848 */ 277, 37011, 37011, 0, 37011, 0, 0, 37011, 0, 37011, 37011, 0, 37011, 37011, 37011, 0, 0, 0, 0, 0, 8277,
  /*  5869 */ 8277, 8277, 12572, 8462, 203, 8302, 8302, 8302, 8302, 8302, 8403, 0, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  5887 */ 8277, 8277, 8277, 8673, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8302, 8771,
  /*  5904 */ 8302, 8302, 8302, 0, 0, 40960, 0, 40960, 40960, 0, 40960, 0, 0, 40960, 0, 0, 40960, 0, 0, 0, 0, 0, 8277,
  /*  5927 */ 8277, 8277, 12572, 8462, 203, 8302, 8302, 8481, 8302, 8302, 0, 340, 0, 346, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  5951 */ 0, 0, 408, 0, 0, 0, 0, 0, 7252, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43008, 0, 0, 0, 0, 0, 8277,
  /*  5981 */ 7252, 0, 0, 8277, 8277, 0, 8277, 8277, 0, 8277, 0, 0, 0, 0, 0, 8277, 8277, 8277, 12572, 8462, 203, 8302,
  /*  6003 */ 8480, 8302, 8302, 8483, 0, 8277, 8277, 8277, 8277, 8277, 8302, 0, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  6021 */ 8302, 8302, 8766, 8767, 8302, 8302, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8783,
  /*  6038 */ 8784, 8302, 8277, 8302, 8302, 8302, 0, 0, 8302, 0, 8302, 8302, 0, 8302, 0, 0, 8302, 0, 0, 8302, 0, 0, 0,
  /*  6061 */ 0, 0, 15360, 15360, 0, 0, 0, 15360, 15360, 15360, 0, 0, 0, 0, 0, 0, 95, 0, 0, 0, 18432, 0, 18432, 18432,
  /*  6085 */ 18432, 0, 18432, 18432, 0, 18432, 18432, 18432, 18432, 18432, 18432, 18432, 18432, 0, 0, 403, 0, 0, 0, 0,
  /*  6105 */ 0, 405, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30720, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8277, 0, 466, 0, 0, 0, 0, 8302,
  /*  6136 */ 8302, 8302, 8302, 8302, 8302, 8752, 8277, 8277, 8755, 8302, 8302, 8758, 8759, 8302, 8302, 8302, 8277,
  /*  6153 */ 8277, 8277, 8277, 8277, 8277, 232, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 0, 0, 0, 8302,
  /*  6174 */ 8302, 8302, 8302, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 8462, 0, 0, 0, 0, 0, 8290, 7252, 0, 0, 8290, 8277, 0,
  /*  6199 */ 8277, 8277, 0, 8290, 0, 0, 0, 0, 0, 39936, 0, 39936, 39936, 39936, 0, 0, 0, 0, 0, 0, 0, 0, 0, 202, 202, 0,
  /*  6225 */ 202, 202, 202, 202, 0, 8277, 8277, 8277, 8277, 8277, 8303, 0, 8277, 8290, 8277, 8290, 8277, 8277, 8303,
  /*  6244 */ 8303, 0, 0, 8303, 0, 8303, 8303, 0, 8303, 0, 0, 8303, 0, 0, 8303, 0, 0, 0, 0, 0, 62464, 0, 0, 0, 0, 0, 0,
  /*  6271 */ 0, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 41984, 41984, 41984, 41984, 41984, 0, 0, 41984, 0, 41984, 0, 41984,
  /*  6294 */ 41984, 0, 0, 0, 0, 0, 105472, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88064, 0, 0, 0, 0, 43008, 43008, 0,
  /*  6321 */ 43008, 0, 0, 43008, 0, 43008, 43008, 43008, 43008, 43008, 43008, 0, 0, 0, 0, 82, 82, 82, 0, 0, 0, 82, 82,
  /*  6344 */ 82, 0, 0, 0, 0, 0, 0, 95, 0, 0, 0, 0, 0, 0, 39936, 0, 0, 0, 0, 7252, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  6375 */ 88, 0, 0, 8277, 7252, 0, 0, 8277, 8277, 0, 8277, 8277, 0, 8277, 0, 88, 0, 8277, 8277, 8277, 8277, 8277,
  /*  6397 */ 8304, 0, 8277, 8313, 8277, 8313, 8277, 8277, 8331, 8331, 148, 148, 8331, 148, 8331, 8331, 148, 8331, 148,
  /*  6416 */ 148, 8331, 148, 148, 8360, 0, 0, 0, 0, 83, 83, 83, 0, 0, 0, 83, 83, 83, 0, 0, 0, 0, 0, 0, 95, 0, 82, 0, 0,
  /*  6445 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 411, 0, 0, 82, 83, 7252, 8277, 0, 0, 0, 0, 0, 187, 0, 0, 0, 95, 95,
  /*  6475 */ 8277, 0, 0, 194, 0, 0, 0, 8277, 8277, 8277, 8277, 0, 8302, 8302, 8302, 8277, 8302, 8790, 8791, 8302, 8277,
  /*  6496 */ 8302, 8277, 8302, 8277, 0, 0, 0, 0, 0, 0, 0, 74752, 0, 0, 0, 0, 0, 0, 0, 74752, 0, 249, 0, 8302, 8302,
  /*  6521 */ 252, 0, 8302, 8446, 8302, 8302, 8302, 8302, 8302, 8302, 8400, 8302, 8302, 0, 8277, 8277, 8277, 8277, 8277,
  /*  6540 */ 8277, 8411, 8412, 8277, 0, 0, 6499, 0, 0, 0, 419, 8277, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8277, 8277,
  /*  6562 */ 8277, 8277, 8302, 8302, 65048, 91673, 0, 8302, 8302, 0, 466, 0, 8302, 8302, 8302, 8302, 8689, 8302, 8277,
  /*  6581 */ 8277, 8277, 8277, 8277, 8693, 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277, 3303, 2186, 8302, 8302, 8302,
  /*  6599 */ 8302, 8302, 8302, 8563, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 0, 0, 8302, 8302, 8302,
  /*  6617 */ 8302, 8302, 8302, 8302, 46080, 0, 0, 0, 8277, 0, 466, 0, 0, 0, 0, 8660, 8302, 8302, 8302, 8302, 8302,
  /*  6638 */ 8402, 8302, 0, 8277, 8405, 8277, 8277, 8277, 8277, 8277, 8277, 8414, 8277, 8667, 8277, 8277, 8277, 8277,
  /*  6656 */ 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8302, 8302, 8302, 8302,
  /*  6673 */ 8302, 0, 8277, 8277, 8277, 8277, 8277, 8305, 0, 8277, 8314, 8277, 8314, 8277, 8277, 8332, 8332, 0, 0,
  /*  6692 */ 8332, 0, 8332, 8332, 162, 8332, 162, 0, 8332, 166, 166, 8361, 0, 0, 0, 0, 94, 0, 95, 8277, 0, 8277, 0, 0,
  /*  6716 */ 0, 0, 0, 0, 0, 0, 0, 12288, 203, 0, 0, 0, 0, 0, 0, 320, 0, 0, 0, 0, 0, 0, 0, 8302, 8302, 0, 8505, 8302,
  /*  6744 */ 8302, 8522, 0, 0, 465, 8277, 0, 466, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8562, 8302, 8277,
  /*  6765 */ 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8570, 8708, 8302, 8277, 8277, 8712, 8277, 8302, 8302,
  /*  6782 */ 8302, 8302, 526, 0, 0, 8302, 8302, 8719, 8788, 8789, 8302, 8302, 8277, 8302, 8277, 8302, 8277, 8302, 8277,
  /*  6801 */ 0, 0, 0, 0, 0, 0, 0, 243, 0, 0, 0, 0, 0, 0, 0, 243, 0, 0, 7252, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 89,
  /*  6833 */ 8277, 7252, 0, 0, 8277, 8277, 0, 8277, 8277, 0, 8277, 0, 0, 0, 8277, 8277, 8277, 8277, 8277, 8306, 0,
  /*  6854 */ 8277, 8315, 8322, 8315, 8322, 8277, 8333, 8333, 149, 149, 8333, 149, 8333, 8333, 149, 8333, 149, 149,
  /*  6872 */ 8333, 149, 149, 8362, 0, 0, 0, 0, 203, 0, 0, 0, 203, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 0,
  /*  6902 */ 0, 0, 0, 8302, 8302, 0, 0, 8302, 8302, 8302, 8302, 8302, 8449, 8302, 8302, 8302, 0, 264, 268, 0, 8462, 0,
  /*  6924 */ 0, 0, 0, 0, 95, 95, 192, 8484, 8302, 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8495,
  /*  6944 */ 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277, 0, 0, 8302, 8302, 8302, 8302, 8430, 8302, 52334, 8302, 8302,
  /*  6963 */ 8302, 8302, 0, 0, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 461, 0, 0, 0, 8277, 8762, 8277, 8302,
  /*  6987 */ 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8302, 8782, 8302, 8302,
  /*  7004 */ 8302, 8277, 8302, 8302, 8302, 90, 0, 0, 0, 0, 0, 95, 8277, 0, 8277, 0, 0, 0, 0, 99, 0, 0, 0, 393, 0, 395,
  /*  7030 */ 8302, 50571, 50573, 8302, 8302, 8591, 8302, 8302, 8302, 0, 0, 0, 0, 8462, 0, 0, 273, 0, 0, 95, 95, 192, 0,
  /*  7053 */ 8277, 8277, 8277, 8277, 8277, 8307, 0, 8277, 8316, 8277, 8316, 8277, 8326, 8307, 8307, 150, 150, 8307,
  /*  7071 */ 150, 8307, 8307, 150, 8307, 150, 150, 8307, 150, 150, 8363, 0, 0, 0, 0, 262, 266, 0, 0, 0, 0, 0, 0, 0, 95,
  /*  7096 */ 95, 192, 0, 82, 83, 7252, 8277, 0, 0, 0, 185, 0, 0, 0, 0, 189, 95, 95, 8277, 193, 0, 0, 0, 0, 0, 8277,
  /*  7122 */ 8277, 8277, 8277, 0, 8302, 8302, 8302, 8486, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  7140 */ 8277, 8497, 8277, 8415, 8416, 8277, 8277, 0, 8277, 8421, 8422, 0, 232, 8302, 8302, 8427, 8302, 8302, 8431,
  /*  7159 */ 0, 0, 0, 8442, 8443, 0, 197, 8302, 8302, 8427, 8302, 66670, 8302, 76910, 8302, 84078, 278, 0, 0, 0, 97280,
  /*  7180 */ 8277, 8474, 8277, 12572, 8462, 203, 8302, 8302, 8302, 8482, 8302, 8277, 57454, 8302, 8277, 8302, 8277,
  /*  7197 */ 8302, 8277, 8302, 8277, 0, 0, 0, 0, 0, 0, 0, 325, 0, 8302, 97390, 0, 8302, 8302, 8302, 8302, 8277, 8277,
  /*  7219 */ 8277, 8277, 8277, 97365, 232, 0, 8302, 8302, 8302, 8302, 8302, 8510, 8302, 0, 0, 0, 489, 8302, 8683, 8302,
  /*  7239 */ 8302, 8302, 0, 0, 0, 461, 0, 0, 0, 0, 0, 0, 95, 2129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109568, 109568,
  /*  7265 */ 109568, 0, 0, 0, 349, 0, 0, 0, 6499, 0, 0, 0, 0, 8277, 8277, 12572, 0, 6499, 8302, 8302, 8277, 8277, 8277,
  /*  7288 */ 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8634, 8277, 8277, 8302, 8777, 8302, 8302, 8302, 8277, 8302,
  /*  7305 */ 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 8302, 8785, 8786, 8302, 8302, 8302, 8277, 8277, 8277,
  /*  7322 */ 8277, 8277, 61525, 8277, 0, 8576, 8302, 8302, 8302, 8580, 8302, 8302, 390, 0, 391, 0, 0, 0, 0, 8302, 0,
  /*  7343 */ 8302, 8590, 8302, 8302, 8592, 8302, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23689, 23689, 0, 0,
  /*  7368 */ 6499, 416, 0, 0, 0, 8277, 0, 0, 0, 0, 8302, 8620, 8302, 8622, 0, 0, 0, 8277, 0, 466, 0, 0, 0, 0, 8302,
  /*  7393 */ 8302, 8662, 8302, 8302, 8302, 8277, 8277, 8277, 8277, 8491, 8277, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  7410 */ 8498, 8277, 8277, 8277, 8669, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302,
  /*  7427 */ 8302, 8277, 8277, 8302, 8302, 8302, 8302, 8774, 94208, 466, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8277,
  /*  7445 */ 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 104533, 8277, 8302, 54357, 94293, 8302, 8302,
  /*  7462 */ 8302, 8302, 507, 0, 0, 94318, 8302, 8302, 8704, 0, 8302, 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  7481 */ 8277, 8277, 8633, 8277, 8277, 8277, 8302, 81920, 49262, 8302, 8721, 8302, 49237, 8277, 8724, 8277, 8302,
  /*  7498 */ 8302, 8302, 8302, 0, 8302, 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8632, 8277, 8277, 8277,
  /*  7516 */ 8635, 8302, 59477, 8277, 8277, 8302, 8302, 8302, 8302, 83054, 8302, 83029, 8277, 8770, 8302, 8302, 8302,
  /*  7533 */ 8302, 8277, 8277, 8277, 8490, 8277, 8277, 8277, 8277, 8494, 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277,
  /*  7551 */ 0, 0, 8302, 8302, 8302, 8302, 8429, 8302, 0, 8277, 8277, 8277, 8277, 8277, 8302, 0, 8277, 8277, 8277,
  /*  7570 */ 8277, 8277, 8277, 8334, 8334, 0, 0, 8334, 0, 8334, 8334, 0, 8334, 0, 0, 8334, 0, 0, 8334, 0, 0, 0, 0, 394,
  /*  7594 */ 0, 8302, 0, 8302, 8302, 8302, 8302, 8302, 8593, 8302, 0, 0, 82, 83, 7252, 8277, 0, 0, 0, 0, 0, 0, 86016,
  /*  7617 */ 0, 0, 95, 95, 8277, 8277, 69717, 8277, 0, 8277, 8277, 8277, 0, 0, 8302, 8302, 8302, 8302, 8302, 8302,
  /*  7637 */ 8487, 8277, 8489, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8674, 8302, 8302, 8302,
  /*  7654 */ 8302, 8302, 151, 151, 8302, 151, 8302, 8302, 151, 8302, 151, 151, 8302, 151, 151, 8364, 0, 0, 0, 0, 6499,
  /*  7675 */ 0, 0, 0, 0, 8277, 8277, 12572, 0, 6499, 8302, 8302, 403, 0, 405, 0, 0, 0, 0, 0, 461, 0, 0, 0, 0, 0, 0, 0,
  /*  7702 */ 184, 0, 0, 0, 0, 202, 202, 202, 202, 184, 184, 184, 184, 202, 202, 202, 202, 0, 202, 202, 0, 82, 83, 7252,
  /*  7726 */ 8277, 0, 0, 0, 0, 0, 0, 0, 188, 0, 95, 95, 0, 0, 0, 8302, 8302, 0, 0, 8302, 8426, 8302, 8302, 8302, 8302,
  /*  7751 */ 8302, 8302, 8302, 8639, 8302, 0, 0, 102400, 0, 0, 0, 8302, 8302, 8302, 8302, 8302, 8750, 8302, 8302, 8753,
  /*  7771 */ 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8760, 8302, 0, 0, 0, 8277, 7252, 0, 0, 8277, 8277, 101, 8277,
  /*  7791 */ 8277, 0, 8277, 0, 0, 0, 0, 6499, 0, 0, 0, 0, 8277, 8277, 12572, 0, 6499, 8557, 8302, 0, 8297, 8297, 8297,
  /*  7814 */ 8297, 8297, 8302, 0, 8297, 8317, 8323, 8317, 8323, 8297, 8302, 8302, 8277, 8277, 8277, 8277, 8302, 8302,
  /*  7832 */ 8302, 8302, 0, 72704, 51200, 51310, 72814, 8302, 152, 160, 8302, 160, 8302, 8302, 160, 8302, 160, 160,
  /*  7850 */ 8302, 160, 160, 8365, 0, 0, 0, 0, 6499, 0, 0, 0, 0, 8277, 8552, 12572, 0, 6499, 8302, 8302, 8277, 8277,
  /*  7872 */ 8277, 8277, 8302, 8302, 8716, 8717, 0, 0, 0, 8302, 8302, 8302, 8277, 8277, 8277, 8277, 8302, 8715, 8302,
  /*  7891 */ 8302, 0, 0, 0, 8302, 8302, 8302, 0, 263, 267, 0, 8462, 0, 0, 0, 0, 0, 95, 95, 192, 0, 0, 0, 8302, 8302, 0,
  /*  7917 */ 0, 8302, 8302, 8447, 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8277, 8628, 8277, 8277, 8277,
  /*  7935 */ 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8697, 8698, 0, 0, 0, 8302, 8302, 8302, 8302, 0, 8302, 8302, 0,
  /*  7955 */ 0, 321, 0, 0, 323, 0, 0, 0, 8302, 8302, 0, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8277, 44554, 8302,
  /*  7976 */ 8302, 8302, 0, 0, 0, 8302, 8302, 8302, 8277, 8277, 8277, 8302, 56865, 8302, 8302, 8302, 8302, 8302, 8277,
  /*  7995 */ 8277, 8277, 8302, 8523, 8302, 8302, 8302, 8527, 0, 0, 0, 0, 0, 0, 0, 0, 8462, 0, 0, 0, 0, 6499, 0, 0, 358,
  /*  8020 */ 0, 96341, 8277, 12572, 0, 6499, 8302, 8302, 8277, 8277, 8277, 8736, 8302, 8302, 8302, 8740, 8302, 8302,
  /*  8038 */ 8743, 8277, 8277, 8302, 8696, 8302, 8302, 0, 0, 0, 8302, 8302, 8302, 8302, 0, 8302, 8302, 0, 0, 6499, 0,
  /*  8059 */ 0, 0, 0, 8277, 0, 0, 0, 0, 8619, 8302, 8302, 8302, 8277, 8277, 8626, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  8080 */ 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 0, 508, 0, 8302, 8302, 8703, 8302, 513, 8302, 8302, 0,
  /*  8099 */ 8298, 8298, 8298, 8298, 8298, 8302, 0, 8298, 8277, 8298, 8277, 8298, 8298, 8302, 8302, 8399, 8302, 8302,
  /*  8117 */ 8302, 0, 8277, 8277, 8277, 8277, 8409, 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277, 0, 0, 8302, 8302,
  /*  8136 */ 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8302, 8761, 153, 153, 8302, 153,
  /*  8154 */ 8302, 8302, 153, 8302, 153, 153, 8302, 153, 153, 8366, 0, 0, 0, 0, 6499, 0, 357, 0, 0, 8277, 8277, 12572,
  /*  8176 */ 0, 6499, 8302, 8302, 8453, 0, 0, 0, 0, 8462, 0, 0, 0, 0, 0, 95, 95, 192, 0, 82, 83, 7252, 8277, 0, 0, 0,
  /*  8202 */ 0, 186, 0, 0, 0, 0, 95, 95, 8277, 8277, 8277, 8277, 0, 8420, 8277, 8277, 0, 0, 8302, 8302, 8302, 8302,
  /*  8224 */ 8302, 8302, 8561, 85102, 8302, 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8569, 85077, 8277, 0, 0, 0,
  /*  8243 */ 8302, 8302, 0, 0, 8302, 8302, 8302, 8399, 8302, 8302, 8302, 8302, 8302, 8625, 8277, 8277, 8277, 8277,
  /*  8261 */ 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8571, 8277, 8277,
  /*  8278 */ 8277, 8277, 8575, 0, 8302, 8577, 8302, 8579, 8302, 8302, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 192,
  /*  8302 */ 8277, 8776, 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8787, 8302, 8302, 8733,
  /*  8319 */ 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8741, 8302, 8277, 8744, 8277, 8302, 0, 8277, 8277, 8277, 8277,
  /*  8337 */ 8277, 8302, 0, 8277, 8318, 8277, 8318, 8277, 8277, 8302, 8302, 8302, 8302, 0, 0, 509, 8302, 8702, 8302,
  /*  8356 */ 8302, 0, 8302, 8302, 154, 154, 8302, 154, 8302, 8302, 154, 8302, 154, 154, 8302, 154, 154, 8367, 0, 0, 0,
  /*  8377 */ 0, 6499, 356, 0, 0, 0, 8277, 8277, 12572, 0, 6499, 8302, 8558, 8277, 8277, 8417, 8277, 0, 8277, 8277,
  /*  8397 */ 8277, 0, 0, 8302, 8302, 8302, 8302, 8302, 8302, 81006, 8302, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 8462, 0, 0, 0,
  /*  8421 */ 0, 241, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141502, 141502, 192, 0, 0, 6499, 0, 0, 0, 0, 8277, 0, 423,
  /*  8449 */ 0, 0, 8302, 8302, 8621, 8302, 8403, 8302, 0, 0, 0, 0, 8462, 0, 0, 0, 274, 0, 95, 95, 192, 0, 91, 0, 0, 0,
  /*  8475 */ 0, 95, 8277, 0, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8302, 8302, 0, 8302, 8302, 8302, 8302, 0, 0, 91, 8277,
  /*  8500 */ 7252, 0, 0, 8277, 8277, 0, 8277, 8277, 0, 8277, 0, 0, 0, 0, 8682, 8302, 8302, 8302, 8302, 0, 0, 0, 461, 0,
  /*  8524 */ 0, 0, 0, 0, 0, 95, 8277, 0, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 245, 0, 0, 100352, 0, 0, 0, 0, 8277, 8277,
  /*  8552 */ 8277, 8277, 8277, 8308, 0, 8277, 8319, 8277, 8319, 8277, 8277, 8308, 8308, 155, 155, 8308, 155, 8308,
  /*  8570 */ 8308, 155, 8308, 155, 155, 8308, 155, 155, 8368, 0, 0, 0, 0, 15360, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  8597 */ 110592, 0, 0, 8277, 8277, 8418, 8277, 0, 8277, 8277, 8277, 0, 0, 8425, 8302, 8302, 8302, 8302, 8302, 8485,
  /*  8617 */ 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8496, 8277, 8277, 8277, 8277, 0, 8277,
  /*  8635 */ 8277, 8277, 0, 0, 8396, 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 8302, 8302, 0, 0, 8445, 8302, 8302, 8302,
  /*  8656 */ 8302, 8450, 8302, 8302, 8302, 8524, 8302, 8302, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 8462, 0, 0, 0, 82, 0, 83, 0,
  /*  8681 */ 0, 0, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 202, 202, 0, 99328, 0, 0, 6499, 0, 0, 0, 0, 8277,
  /*  8710 */ 8277, 12572, 0, 6499, 8302, 8302, 8525, 8302, 8302, 8302, 0, 0, 340, 0, 0, 0, 346, 0, 8462, 0, 0, 0, 184,
  /*  8733 */ 0, 0, 0, 0, 0, 0, 202, 202, 202, 202, 202, 202, 184, 184, 184, 184, 184, 184, 184, 184, 184, 184, 184,
  /*  8756 */ 184, 184, 202, 0, 0, 0, 87125, 0, 0, 0, 0, 0, 0, 8302, 8661, 8302, 8663, 8302, 8302, 8560, 8302, 8302,
  /*  8778 */ 8302, 8302, 8277, 8277, 8277, 8566, 8277, 8568, 75861, 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277, 0, 0,
  /*  8797 */ 8302, 8397, 8398, 8428, 8302, 8302, 8277, 8277, 8668, 8277, 8670, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  8814 */ 8302, 8676, 8302, 8302, 8302, 8624, 8277, 8277, 8277, 8627, 8277, 8629, 8277, 8631, 8277, 8277, 8277,
  /*  8831 */ 8277, 8277, 8302, 8765, 8302, 8302, 8302, 8302, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8751, 8302,
  /*  8848 */ 8277, 8754, 8277, 8302, 8757, 8302, 8302, 8302, 8302, 8302, 0, 0, 488, 0, 8302, 8302, 8302, 8684, 8302, 0,
  /*  8868 */ 0, 103424, 0, 0, 0, 0, 0, 0, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 82, 0, 0, 0, 8302, 8302,
  /*  8899 */ 8688, 8302, 8302, 8302, 8277, 8277, 8277, 8692, 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277, 0, 0, 8302,
  /*  8918 */ 8426, 8302, 8302, 8302, 8302, 8526, 8302, 0, 0, 0, 0, 0, 0, 0, 0, 8462, 0, 61440, 8277, 8277, 8763, 8302,
  /*  8940 */ 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 45166, 8302, 8302, 8302,
  /*  8957 */ 8302, 8277, 8302, 8302, 8302, 0, 0, 92, 0, 0, 0, 95, 8277, 0, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8302, 8486,
  /*  8983 */ 0, 8302, 8302, 8302, 8302, 0, 0, 0, 8277, 7252, 0, 0, 8277, 8277, 102, 8277, 8277, 0, 8277, 102, 102, 0,
  /*  9005 */ 8277, 8277, 8277, 8277, 8300, 8302, 0, 8312, 8277, 8312, 8277, 8312, 8277, 8302, 8302, 8778, 8779, 8302,
  /*  9023 */ 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 8302,
  /*  9040 */ 8302, 8277, 8302, 65646, 92270, 156, 156, 8302, 156, 8302, 8302, 156, 8302, 156, 163, 8302, 156, 156,
  /*  9058 */ 8369, 0, 0, 0, 0, 18432, 0, 0, 0, 0, 0, 0, 0, 0, 18432, 18432, 18432, 8397, 8398, 8302, 8401, 8302, 8302,
  /*  9081 */ 0, 8277, 8277, 8407, 8408, 8277, 8277, 8277, 8413, 8277, 8277, 8277, 8277, 0, 8277, 8277, 8277, 24576,
  /*  9099 */ 3303, 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8564, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277,
  /*  9116 */ 4408, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 100352, 0, 0, 8302, 8302, 0, 100352, 8302, 8397, 8398,
  /*  9135 */ 8302, 8302, 8302, 8302, 8451, 8401, 8277, 8277, 8572, 8277, 8574, 8277, 8277, 0, 8302, 8302, 8302, 8302,
  /*  9153 */ 8302, 8302, 8302, 0, 338, 0, 0, 0, 344, 0, 0, 8462, 0, 0, 0, 0, 392, 0, 0, 0, 8302, 0, 8302, 8302, 8302,
  /*  9178 */ 8302, 8302, 8302, 8594, 0, 0, 0, 2129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40960, 40960, 0, 0,
  /*  9205 */ 404, 0, 264, 0, 0, 0, 406, 0, 268, 0, 0, 0, 0, 0, 0, 0, 19456, 0, 0, 0, 0, 0, 19456, 0, 0, 0, 0, 6499, 0,
  /*  9234 */ 0, 0, 0, 8612, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8637, 8302, 8302, 8640, 0, 0, 0, 0, 0, 0, 8302, 8302,
  /*  9258 */ 8302, 8302, 8302, 0, 494, 0, 461, 0, 0, 0, 0, 0, 0, 8277, 0, 0, 0, 467, 0, 363, 8302, 8302, 8302, 8302,
  /*  9282 */ 8302, 8302, 8709, 8277, 8277, 8277, 8713, 8302, 8302, 8302, 8302, 0, 0, 0, 8302, 8302, 8302, 8277, 47189,
  /*  9301 */ 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8678, 8277,
  /*  9318 */ 8277, 8695, 8302, 8302, 8302, 0, 0, 0, 8302, 8302, 8302, 8302, 0, 8302, 8302, 8732, 8277, 8277, 8735,
  /*  9337 */ 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8302, 8302,
  /*  9354 */ 8277, 8277, 8277, 8302, 0, 8277, 8277, 8277, 8277, 8277, 8309, 0, 8277, 8320, 8277, 8320, 8277, 8277,
  /*  9372 */ 8335, 8335, 0, 0, 8335, 0, 8335, 8335, 0, 8335, 0, 0, 8335, 0, 0, 8335, 0, 0, 0, 0, 38912, 0, 0, 0, 0, 0,
  /*  9398 */ 0, 0, 0, 0, 0, 0, 0, 0, 8277, 8277, 8277, 8419, 0, 8277, 8277, 8277, 0, 0, 8302, 8302, 8302, 8302, 8302,
  /*  9421 */ 8302, 8748, 8749, 8302, 8302, 8302, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8277,
  /*  9438 */ 8277, 8277, 8746, 0, 279, 0, 281, 0, 8277, 8277, 8277, 12572, 8462, 203, 8302, 8302, 8302, 8302, 8302,
  /*  9457 */ 100462, 8302, 0, 0, 0, 0, 8462, 0, 0, 0, 0, 0, 95, 95, 192, 8499, 8500, 8277, 8277, 8503, 8277, 0, 0,
  /*  9480 */ 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 339, 0, 0, 0, 345, 0, 0, 8462, 0, 0, 0, 340, 0, 0, 0, 0, 0,
  /*  9505 */ 346, 0, 0, 0, 0, 0, 0, 0, 413, 0, 0, 6499, 0, 0, 0, 0, 8277, 0, 424, 0, 0, 8302, 8302, 8302, 8302, 102510,
  /*  9531 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 463, 0, 0, 0, 8277, 0, 0, 425, 0, 0, 0, 8302, 8302, 8302, 8302,
  /*  9559 */ 8664, 8302, 8277, 8277, 8277, 8277, 8277, 8671, 8277, 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302,
  /*  9576 */ 8302, 8302, 8277, 8277, 8302, 8302, 8772, 8773, 8302, 0, 0, 0, 8302, 8302, 0, 0, 8302, 8302, 8302, 62574,
  /*  9596 */ 8302, 8302, 8302, 8302, 8302, 103, 8277, 8277, 8277, 8277, 8277, 8302, 103, 8277, 8277, 8277, 8277, 8277,
  /*  9614 */ 8327, 8302, 8302, 0, 0, 8302, 0, 8302, 8302, 0, 8302, 0, 0, 8356, 103, 103, 8302, 0, 0, 0, 0, 80896, 0, 0,
  /*  9638 */ 0, 0, 8302, 8302, 0, 46190, 8302, 8302, 8302, 0, 265, 269, 0, 8462, 0, 0, 0, 0, 0, 95, 95, 192, 248, 0,
  /*  9662 */ 88064, 8302, 8302, 0, 248, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 88174, 8452, 8302, 0, 0,
  /*  9681 */ 0, 0, 8462, 0, 0, 0, 0, 275, 95, 95, 192, 8277, 8277, 8501, 8277, 8277, 8277, 0, 0, 8302, 8302, 8302,
  /*  9703 */ 8302, 8509, 8302, 8302, 0, 0, 0, 0, 0, 0, 460, 0, 0, 0, 462, 0, 353, 0, 0, 8277, 8277, 8299, 8277, 8299,
  /*  9727 */ 8302, 0, 8299, 8277, 8299, 8277, 8299, 8277, 8336, 8336, 0, 0, 8336, 0, 8336, 8336, 0, 8336, 0, 0, 8336,
  /*  9748 */ 0, 0, 8336, 0, 0, 0, 82, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95, 95, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 203,
  /*  9780 */ 0, 0, 0, 0, 0, 0, 82, 83, 7252, 8277, 0, 0, 48128, 0, 0, 0, 0, 0, 0, 95, 95, 0, 0, 0, 8302, 8302, 0, 0,
  /*  9808 */ 8302, 8302, 8302, 8302, 8302, 74862, 8302, 8302, 8302, 8277, 8277, 8277, 8502, 8277, 8277, 0, 0, 8302,
  /*  9826 */ 8302, 8507, 8302, 8302, 8302, 8302, 0, 0, 0, 0, 8462, 0, 0, 0, 0, 0, 95, 95, 192, 0, 0, 350, 0, 6499, 0,
  /*  9851 */ 0, 0, 0, 8277, 8277, 12572, 0, 6499, 8302, 8302, 8623, 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8630,
  /*  9870 */ 8277, 8277, 8277, 8277, 8277, 8277, 8636, 71680, 0, 0, 8277, 0, 0, 0, 0, 0, 0, 8302, 8302, 8302, 8302,
  /*  9891 */ 8302, 8665, 8277, 8277, 8277, 8277, 8277, 8277, 8672, 8277, 8277, 71765, 8277, 8302, 8302, 8302, 8302,
  /*  9908 */ 8302, 0, 487, 0, 0, 8302, 8302, 8302, 8302, 8685, 0, 0, 0, 0, 414, 0, 89088, 0, 0, 425, 8302, 8302, 8302,
  /*  9931 */ 8302, 8302, 8690, 89173, 8277, 8277, 8277, 8277, 8277, 8694, 8277, 8277, 8277, 8764, 8302, 8302, 8302,
  /*  9948 */ 8302, 8768, 8277, 8769, 8302, 8302, 8302, 8302, 8302, 104, 8277, 8277, 8277, 8277, 8277, 8310, 104, 8277,
  /*  9966 */ 8321, 8277, 8321, 8277, 8328, 8310, 8310, 157, 157, 8310, 161, 8310, 8310, 161, 8310, 161, 157, 8357, 167,
  /*  9985 */ 167, 8370, 0, 0, 0, 93, 0, 0, 95, 8277, 0, 8277, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8519, 8302, 0, 8302, 8302,
  /* 10011 */ 8302, 8302, 0, 0, 0, 8302, 8302, 0, 0, 8396, 8302, 8302, 8302, 67694, 8302, 78958, 8302, 8302, 0, 0, 280,
  /* 10032 */ 0, 0, 77909, 8277, 8475, 12572, 8462, 203, 8479, 8302, 8302, 8302, 8302, 98389, 8277, 8277, 8277, 8277,
  /* 10050 */ 8277, 8277, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 450, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8649,
  /* 10071 */ 414, 0, 6499, 0, 417, 0, 0, 8277, 0, 0, 425, 0, 8302, 8302, 8302, 8302, 101486, 8302, 0, 0, 0, 0, 0, 0, 0,
  /* 10096 */ 0, 0, 0, 0, 0, 0, 0, 133, 0, 0, 0, 464, 0, 8277, 0, 0, 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8302, 8302,
  /* 10122 */ 8666, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 70741, 8277, 8277, 8675, 8302, 8302, 90222, 8302, 63488,
  /* 10139 */ 0, 0, 0, 8302, 8302, 63598, 8302, 8302, 55296, 0, 0, 0, 0, 60416, 0, 0, 0, 8277, 0, 0, 0, 0, 0, 0, 8302,
  /* 10164 */ 8302, 8302, 8302, 8302, 8302, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277, 8277,
  /* 10181 */ 8277, 8302, 0, 0, 0, 8302, 53358, 8302, 60526, 8302, 8302, 8277, 8277, 53333, 8277, 60501, 8277, 8277,
  /* 10199 */ 8277, 8277, 0, 8277, 8277, 8277, 0, 232, 8302, 8302, 8302, 8302, 8302, 8302, 98414, 8277, 8277, 8277,
  /* 10217 */ 8277, 8277, 8277, 8277, 8277, 8277, 8277, 0, 0, 8302, 8302, 8302, 8508, 8302, 8302, 8511, 0, 8775, 8302,
  /* 10236 */ 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 8302, 8780, 8781,
  /* 10253 */ 8302, 8302, 8302, 8302, 8302, 8277, 8302, 8302, 8302, 158, 158, 8302, 158, 8302, 8302, 158, 8302, 158,
  /* 10271 */ 158, 8302, 158, 158, 8371, 0, 0, 0, 202, 202, 0, 0, 202, 202, 202, 202, 202, 202, 202, 202, 202, 0, 0,
  /* 10294 */ 195, 8302, 8302, 0, 0, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8302, 8559, 8302, 8302, 8302, 8302,
  /* 10313 */ 8302, 8277, 8277, 8277, 8277, 8567, 8277, 8277, 8277, 8277, 8277, 8277, 0, 0, 8302, 8506, 8302, 8302,
  /* 10331 */ 8302, 8302, 8302, 0, 0, 0, 341, 0, 0, 0, 347, 8462, 0, 0, 8277, 8277, 8277, 8573, 8277, 8277, 8277, 0,
  /* 10353 */ 8302, 8302, 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 0, 8462, 0, 272, 0, 0, 0, 95, 95, 192, 0, 415, 6499, 0,
  /* 10377 */ 0, 418, 0, 8277, 0, 0, 0, 426, 8302, 8302, 8302, 8302, 0, 0, 0, 8687, 8302, 8302, 8302, 8302, 8302, 8277,
  /* 10399 */ 8691, 8277, 8277, 8277, 8277, 8277, 8277, 0, 0, 8505, 8302, 8302, 8302, 8302, 8302, 8302, 0, 0, 0, 0,
  /* 10419 */ 101376, 0, 8302, 8302, 8302, 8302, 8302, 58368, 0, 0, 0, 0, 0, 0, 0, 0, 8302, 8302, 0, 8302, 8302, 58478,
  /* 10441 */ 8302, 68608, 0, 0, 0, 0, 0, 8302, 0, 8302, 8302, 68718, 8302, 8302, 8302, 8302, 0, 0, 0, 0, 8462, 271, 0,
  /* 10464 */ 0, 0, 0, 95, 95, 192, 0, 8277, 8277, 8277, 8277, 8277, 8302, 0, 8277, 8277, 8277, 8277, 8324, 8277, 8302,
  /* 10485 */ 8302, 0, 0, 0, 8302, 8302, 0, 0, 8302, 8302, 8302, 8448, 8302, 8302, 8302, 8302, 8302, 0, 0, 6499, 0, 0,
  /* 10507 */ 0, 0, 8277, 422, 0, 0, 0, 8302, 8302, 8302, 8302, 0, 105472, 105472, 105472, 105472, 105472, 0, 0, 105472,
  /* 10527 */ 0, 105472, 0, 105472, 105472, 0, 0, 0, 240, 0, 0, 0, 244, 0, 0, 0, 0, 0, 246, 0, 247, 105472, 105472, 0,
  /* 10551 */ 105472, 0, 0, 105472, 0, 105472, 105472, 0, 105472, 105472, 105472, 0, 0, 0, 322, 0, 0, 322, 0, 0, 8302,
  /* 10572 */ 8302, 0, 8302, 8302, 8302, 8302, 106655, 106655, 0, 106655, 0, 0, 106655, 0, 106655, 106655, 0, 106655,
  /* 10590 */ 106655, 106655, 0, 0, 0, 351, 0, 0, 0, 0, 0, 0, 0, 0, 361, 0, 0, 0, 0, 0, 0, 95, 0, 0, 0, 0, 0, 21504, 0,
  /* 10619 */ 0, 21504, 0, 0, 108544, 0, 108544, 0, 0, 0, 0, 0, 0, 0, 0, 108544, 0, 0, 0, 352, 6499, 0, 0, 0, 0, 8277,
  /* 10645 */ 8277, 12572, 362, 6499, 8302, 8302, 403, 0, 405, 0, 0, 0, 0, 410, 461, 0, 0, 0, 0, 0, 0, 0, 0, 41984, 0,
  /* 10670 */ 0, 0, 41984, 0, 0, 0, 109568, 0, 0, 0, 0, 0, 0, 109568, 0, 0, 0, 0, 0, 109568, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 10699 */ 0, 0, 0, 0, 0, 409, 0, 0, 111616, 0, 0, 0, 0, 0, 0, 111616, 0, 0, 0, 0, 0, 111616, 0, 0, 0, 353, 6499, 0,
  /* 10727 */ 0, 0, 0, 8277, 8277, 12572, 363, 6499, 8302, 8302, 8277, 8277, 8277, 8277, 8302, 8302, 8302, 8302, 0, 0,
  /* 10747 */ 0, 8302, 8302, 8302, 8302, 0, 8302, 8302, 0, 0, 0, 11264, 11264, 11264, 0, 0, 11264, 0, 11264, 0, 11264,
  /* 10768 */ 11264, 0, 0, 0, 353, 6499, 0, 0, 0, 359, 8277, 8277, 12572, 363, 6499, 8302, 8302, 8638, 8302, 8302, 0, 0,
  /* 10790 */ 0, 0, 0, 0, 8302, 8302, 8302, 8302, 8302, 8710, 8711, 8277, 8277, 8302, 8302, 8302, 8302, 0, 0, 0, 8302,
  /* 10811 */ 8302, 8302, 8302, 0, 8706, 8707
];

grammar.EXPECTED =
[
  /*    0 */ 76, 84, 92, 100, 107, 125, 239, 246, 178, 148, 133, 260, 253, 141, 193, 156, 163, 171, 186, 224, 201, 209,
  /*   22 */ 543, 417, 217, 448, 232, 557, 268, 283, 298, 291, 562, 306, 314, 321, 329, 337, 387, 521, 349, 372, 357,
  /*   43 */ 365, 380, 395, 402, 410, 425, 433, 441, 456, 464, 472, 480, 488, 496, 514, 529, 112, 583, 506, 537, 341,
  /*   64 */ 551, 570, 275, 501, 117, 580, 572, 571, 571, 571, 571, 112, 591, 598, 615, 602, 602, 604, 608, 612, 619,
  /*   85 */ 623, 594, 627, 631, 638, 634, 642, 646, 653, 649, 657, 661, 670, 696, 1042, 684, 696, 711, 972, 692, 701,
  /*  106 */ 711, 711, 710, 716, 692, 723, 696, 696, 696, 679, 696, 696, 696, 696, 789, 696, 696, 737, 696, 1105, 975,
  /*  127 */ 692, 692, 984, 744, 696, 730, 696, 1106, 692, 984, 743, 743, 987, 997, 792, 765, 770, 692, 711, 711, 981,
  /*  148 */ 692, 979, 711, 711, 711, 712, 692, 693, 982, 694, 977, 760, 979, 982, 694, 977, 980, 983, 760, 979, 983,
  /*  169 */ 692, 981, 692, 979, 983, 692, 981, 692, 777, 692, 986, 743, 748, 788, 791, 754, 770, 983, 718, 692, 983,
  /*  190 */ 719, 774, 779, 696, 692, 695, 1000, 769, 692, 980, 711, 797, 793, 1213, 800, 803, 807, 811, 814, 818, 822,
  /*  211 */ 826, 696, 835, 1104, 696, 832, 899, 856, 696, 696, 905, 1104, 1181, 696, 697, 666, 696, 696, 696, 664, 786,
  /*  232 */ 880, 863, 706, 904, 1188, 1055, 871, 696, 710, 757, 692, 978, 711, 711, 711, 734, 692, 693, 696, 696, 761,
  /*  253 */ 692, 695, 1105, 692, 985, 988, 998, 999, 792, 765, 692, 979, 711, 711, 981, 867, 877, 696, 1187, 887, 863,
  /*  274 */ 922, 696, 790, 696, 696, 990, 738, 696, 686, 896, 904, 696, 696, 696, 906, 696, 1182, 904, 893, 904, 696,
  /*  295 */ 907, 696, 1182, 696, 848, 877, 867, 877, 1186, 881, 864, 903, 787, 1183, 874, 878, 875, 1184, 889, 1188,
  /*  315 */ 1190, 911, 911, 889, 1188, 1191, 912, 919, 914, 915, 1075, 913, 1117, 1032, 915, 1119, 913, 1117, 724,
  /*  334 */ 1117, 724, 1119, 1117, 724, 1120, 926, 696, 696, 696, 696, 788, 696, 696, 696, 959, 696, 696, 696, 963,
  /*  354 */ 696, 928, 969, 696, 1021, 696, 1026, 1040, 1046, 1052, 1180, 1059, 1029, 696, 696, 851, 788, 1072, 995,
  /*  373 */ 696, 1004, 1009, 828, 1005, 1015, 1179, 696, 1083, 1089, 827, 1094, 1077, 1177, 696, 848, 964, 696, 696,
  /*  392 */ 696, 851, 965, 1155, 1022, 674, 1101, 865, 750, 676, 696, 849, 696, 930, 1187, 696, 1084, 1090, 1011, 1085,
  /*  412 */ 1079, 1104, 1127, 672, 782, 1104, 839, 865, 843, 847, 696, 696, 1191, 1110, 696, 696, 696, 849, 696, 928,
  /*  432 */ 1115, 696, 1193, 1090, 1193, 1078, 1104, 1128, 781, 1103, 1111, 696, 850, 696, 928, 1115, 696, 874, 878,
  /*  451 */ 866, 876, 696, 1185, 1102, 696, 1068, 1192, 1097, 1104, 1129, 1134, 1064, 851, 1124, 696, 1067, 696, 1036,
  /*  470 */ 1016, 1133, 1138, 1193, 1193, 1016, 704, 1139, 1194, 1194, 1017, 1066, 1194, 914, 1195, 879, 1034, 1194,
  /*  488 */ 914, 1195, 879, 1143, 879, 1170, 1168, 879, 1170, 1169, 1147, 1148, 879, 696, 696, 696, 858, 696, 696, 696,
  /*  508 */ 696, 1207, 1211, 725, 696, 696, 696, 1152, 696, 696, 1048, 696, 782, 696, 934, 937, 941, 945, 951, 949,
  /*  528 */ 955, 1159, 1161, 1062, 1165, 1174, 1201, 1203, 1199, 726, 696, 696, 680, 696, 696, 696, 696, 874, 878, 852,
  /*  548 */ 877, 696, 996, 696, 991, 739, 696, 696, 688, 696, 696, 885, 696, 879, 696, 875, 879, 876, 1185, 888, 921,
  /*  569 */ 1189, 678, 696, 696, 696, 696, 696, 696, 696, 696, 989, 687, 696, 859, 696, 696, 696, 696, 696, 791, 696,
  /*  590 */ 696, 65794, 65808, 65856, 65920, 536936704, 115088, 82320, 82176, 98560, 196864, 327936, 65792, 65792,
  /*  604 */ 65792, 65792, 67174912, 65922, 82192, 65952, 213248, 134316288, 1245440, 196864, 196864, 1114368,
  /*  616 */ 134283520, 268501248, 536936704, 268501248, 65792, 65792, 65954, 196944, 114960, 82192, 328096, 82192,
  /*  628 */ 459168, 538116352, 538116352, 69888, 115088, 115088, 116112, 98720, 116112, 360864, 116112, 116112, 68000,
  /*  641 */ 51581184, 116112, 120208, 12700094, 63031742, -1069604608, -1069604608, 65653182, -1069604608, -264298240,
  /*  651 */ 13883838, -1019268864, 65784254, 65653182, -1069604608, 65784254, -1019236096, -1057228354, 256, 65536, 2,
  /*  662 */ 16, 16, 64, 67108864, 512, 16384, 2097152, 134217728, 128, 134217728, 268435456, 0, 4, 128, 16384, 0, 0, 0,
  /*  680 */ 1, 16, 0, 0, 67109376, 160, 0, 0, 4, 8, 0, 0, 2176, 2176, 2176, 2176, 0, 0, 0, 0, 2, 2176, 2176, 33554432,
  /*  704 */ 128, 64, 0, 0, 4096, 16777216, 0, 128, 128, 128, 128, 8, 8388620, 14, 2176, 2176, 128, 2176, 2176, 8192,
  /*  724 */ 0x80000000, 0, 0, 0, 6, 8, 0, 512, 512, 32, 128, 128, 12, 8, 0, 4, 0, 0, 0, 16, 16, 16, 16, 128, 16, 128,
  /*  750 */ 0, 0, 4, 192, 0, 128, 128, 2048, 2176, 2080, 2176, 0, 2176, 2176, 0, 2080, 2080, 2080, 2080, 0, 2080, 2080,
  /*  772 */ 2176, 2176, 128, 2176, 128, 2176, 128, 128, 2176, 128, 0, 64, 0, 0, 4, 2097152, 0, 0, 0, 32, 0, 0, 0, 128,
  /*  796 */ 384, 0, 128, 0, 256, 256, 256, 256, 101220352, 516, 256, 101228544, 1048832, 101228544, 1048832, 134218020,
  /*  812 */ -959673216, -959673216, 822088251, -959673216, 822088251, -959673216, -959673152, 822219323, -959673152,
  /*  821 */ 822219387, 822088315, -959672700, 822285119, 822285119, -137388357, 0, 0, 0, 512, 8192, 0, 67108864, 4, 0,
  /*  836 */ 0, 16384, 2097152, 0, 35840, 786432, 46137344, 1, 48, 4096, 16777216, 805306368, 0, 0, 0, 32768, 0, 0, 0,
  /*  855 */ 40960, 62914560, 872415232, 0, 0, 16, 0, 0, 262144, 12582912, -1073741824, 0, 0, 0, 8192, 32768, 196608,
  /*  872 */ 16777216, 536870912, 0, 0, 32768, 524288, 33554432, 67108864, 0, 0, 0, 3072, 262144, 0, 2097152, 134217728,
  /*  888 */ 0, 0, 3072, 12582912, -1073741824, 0, 131072, 0, 131072, 0, 196608, 196608, 0, 39936, 983040, 131072,
  /*  904 */ 536870912, 0, 0, 0, 2097152, 0, 0, 0, 32768, 33554432, 0, 0, 33554432, 0, 0, 2048, 12582912, -1073741824,
  /*  922 */ 0, 0, 536870912, 0, 0, 8388608, 0, 0, 32, 4194304, 134217728, 536870912, 4194304, 4194304, 1207959552,
  /*  937 */ 2056, 536872968, 2056, 537921544, -2080047104, 1207959552, 542115848, -2080038400, 542115896, -2080038400,
  /*  947 */ 542115896, 1207961608, -1752891392, 2250183, -1752891392, -1752891392, 2250119, 2250183, 2250183,
  /*  956 */ -1752891392, 2250183, 6444487, -544931840, 1210209735, 1210209735, -1750641209, 32768, 524288, 0, 0, 0,
  /*  968 */ 4194336, 134217728, 1073741824, 8, 2048, 2176, 2208, 2176, 0, 0, 2176, 2176, 2176, 128, 128, 128, 2176,
  /*  985 */ 2176, 2176, 16, 16, 16, 0, 0, 0, 8, 0, 536870912, 1048576, 0, 0, 32, 32, 32, 0, 0, 0, 327680, 67108864,
  /* 1007 */ 0x80000000, 0, 0, 5242880, 0, 0, 512, 65536, 56, 0, 0, 0, 50331648, 128, 125829120, 268435456, 0, 0, 0, 3,
  /* 1027 */ 388, 5120, 16384, 458752, 2097152, 0x80000000, 0, 33554432, 0, 65536, 67108864, 0, 134217728, 131072,
  /* 1041 */ 2097152, 0, 0, 512, 66048, 0, 452, 0, 0, 1024, 0, 6291456, 134217728, -1073741824, 0, 0, 196608, 7168, 0,
  /* 1060 */ 3, 452, 5120, 64, 0, 64, 128, 0, 65536, 67108864, 4194304, 0, 4194304, 134217728, 1073741824, 2048,
  /* 1076 */ 12582912, 0x80000000, 0, 16, 32, 0, 0, 0, 65536, 262144, 67108864, 0x80000000, 0, 0x80000000, 4194304, 0,
  /* 1092 */ 0, 0, 8192, 65536, 262144, 67108864, 0, 16, 32, 192, 0, 0, 134217728, 0, 0, 0, 2176, 0, 4, 64, 128, 0, 0,
  /* 1115 */ 134217728, 1048576, 0, 0, 2048, 8388608, 0x80000000, 0, 0, 0, 4194304, 134217728, 0, 0, 8388608, 50331648,
  /* 1131 */ 0, 128, 128, 64, 0, 134217728, 0, 0, 64, 128, 32768, 0, 33554432, 65536, 67108864, 65536, 0, 67108864,
  /* 1149 */ 67108864, 67108864, 67108864, 1, 16, 64, 0, 0, 8388608, 117440512, 0, 5120, 64, 576, 64, 0, 0, 96, 7744, 0,
  /* 1169 */ 0, 33554432, 67108864, 67108864, 0, 0, 458, 458, 0, 0, 134217728, 1073741824, 0, 0, 0, 67108864, 0, 0,
  /* 1187 */ 1048576, 0, 0, 0, 131072, 0, 0, 0, 65536, 67108864, 0, 65536, 5582, 5582, 462, 0, 0, 462, 458, 5120, 0, 2,
  /* 1209 */ 8, 256, 0, 6, 0, 0, 16384, 4
];

grammar.TOKEN =
[
  "(0)",
  "IntegerLiteral",
  "DecimalLiteral",
  "DoubleLiteral",
  "StringLiteral",
  "URIQualifiedName",
  "NCName",
  "QName",
  "S",
  "CommentContents",
  "EOF",
  "Wildcard",
  "'!'",
  "'!='",
  "'$'",
  "'('",
  "'(:'",
  "')'",
  "'*'",
  "'+'",
  "','",
  "'-'",
  "'.'",
  "'..'",
  "'/'",
  "'//'",
  "':)'",
  "'::'",
  "':='",
  "';'",
  "'<'",
  "'<<'",
  "'<='",
  "'='",
  "'=>'",
  "'>'",
  "'>='",
  "'>>'",
  "'?'",
  "'@'",
  "'['",
  "']'",
  "'ancestor'",
  "'ancestor-or-self'",
  "'and'",
  "'array'",
  "'as'",
  "'attribute'",
  "'cast'",
  "'castable'",
  "'child'",
  "'comment'",
  "'declare'",
  "'default'",
  "'descendant'",
  "'descendant-or-self'",
  "'div'",
  "'document-node'",
  "'element'",
  "'else'",
  "'eq'",
  "'except'",
  "'following'",
  "'following-sibling'",
  "'ge'",
  "'gt'",
  "'idiv'",
  "'if'",
  "'import'",
  "'inputs'",
  "'instance'",
  "'intersect'",
  "'is'",
  "'item'",
  "'le'",
  "'let'",
  "'lt'",
  "'map'",
  "'mod'",
  "'namespace'",
  "'namespace-node'",
  "'ne'",
  "'node'",
  "'of'",
  "'option'",
  "'or'",
  "'outputs'",
  "'parent'",
  "'preceding'",
  "'preceding-sibling'",
  "'processing-instruction'",
  "'replace'",
  "'self'",
  "'step'",
  "'tee'",
  "'text'",
  "'then'",
  "'to'",
  "'treat'",
  "'union'",
  "'version'",
  "'xproc'",
  "'{'",
  "'|'",
  "'||'",
  "'}'",
  "(106)",
  "(107)",
  "(108)"
];

// End
