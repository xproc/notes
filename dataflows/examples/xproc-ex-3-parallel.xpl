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

:)

inputs $source as document-node();
outputs $result as document-node(),
        $toc as document-node();

$source → xinclude() ≫ $included

$included
 → { if (xs:int($1/*/@version) < 2.0)
     then [$1,"v1schema.xsd"] → validate-with-xml-schema() ≫ @1
     else [$1,"v2schema.xsd"] → validate-with-xml-schema() ≫ @1
   }
 → [$1,"stylesheet.xsl"] → xslt()
 ≫ $result

[$included,"toc.xsl"] → xslt() ≫ $toc
