xproc version = "2.0";

(: This example contains a simple step declaration that is implemented in XQuery
   The step has a function-like signature that can be used in a flow or in an
   XQuery context.

   Within XQuery, the step is invoked as a function call but returns a step
   result.  This result can be interogated for the output ports.  The use of the
   '=>' operator causes an output port to be invoked like a function
   (e.g., ^result(...) ) and appends a result to the output sequebce for that
   port.

   Within a flow, the step can be executed like a function call as well but the
   result mappings are via the flow.  The '=>' operator chains primary outputs
   as in a function call mapping (i.e., to the first argument) but implementations
   are free to optimize this connection.
   
:)

declare step my:fibonacci(
  $n as xs:integer
) output ^result as xs:integer*
{
  declare function my:fibonacci-calc($n as xs:integer) {
    if ($n < 0) then ()
    else if ($n = 0) then 0 
    else if ($n = 1) then 1 
    else myfn:fibonacci-calc($n - 1) + myfn:fibonacci-calc($n - 2)
  };
  my:fibonacci-calc($n) => ^result  (: same as ^result(my:fibonacci-calc($n)) :)
};

flow output ^result as xs:integer {
   my:fibboannci(10) => ^result
}
