xproc version = "2.0";

(:
   There can only be one flow in an XProc module.  As such, parallel processing
   must declare all the inputs and outputs on that flow. nOnce inside the flow,
   the parallel flows can be specified via a flow sequence.

   These two flows may execute in parallel producing completely
   separate outputs without interacting with each other.  

:)

inputs $source as document-node(),
       $other as document-node();
outputs $result1 as document-node(),
        $result2 as document-node();

$source → xinclude()
        → [$1,"schema.xsd"] → validate-with-xml-schema()
        → [$1,"style.xsl"] → xslt()
        ≫ $result1
        
$other → xinclude()
       → [$1,"schema.xsd"] → validate-with-xml-schema()
       → [$1,"style.xsl"] → xslt()
       ≫ $result2
