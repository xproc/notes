xproc version = "2.0";

(: This example is a modified version of example 3 from XProc 1.0.  It allows
   parallel transformation of a single document.

   The subgraph that executes the XInclude is stored in a variable and
   referenced later in both parallel flows.  The use of the '^' prefix
   for output ports allows the expression '$included^result' to make
   sense.  This syntax could certainly be replaced with a more function-like
   invocation too.

   The parallel flows are output to two separate output ports in the example
   (^html and ^toc).  It would be just as easy to have a meet in the graph and
   have one output port.

   ISSUE: The parallel flows are just comma-separted following the let statement.  An
   open issue here is the lack of a comma would either be a syntax error or two
   completely separate flows.  If the latter, lots of simple programming errors could
   result because of an omitted comma.

:)

flow (^source as document-node()) output ^html as document-node(), ^toc as document-node() {

  let $included := ^source => p:include()
    flow {
      if (number(^source/*/@version) < "2.0") 
      then $included^result => p:validate-with-xml-schema(doc("v1schema.xsd"))
      else $included^result => p:validate-with-xml-schema(doc("v2schema.xsd")) 
      => p:xslt(doc("stylesheet.xsl")
      => ^result,
      $included^result => p:xslt(doc("toc.xsl")) => ^toc
    }
}
