xproc version = "2.0";

(: This example is from the XProc 1.0 specificaiton (example 3).

   The input document can be interogated via the input port within the
   if expression.  We would allow a limited amount of branching constructs
   but the expressions shouldn't be limited.

   Here we can see how the input on ^source maps to the conditional and
   the use in the alternate first steps.  
:)

inputs $source as document-node();
outputs $result as document-node();

$source → { if (xs:int($1/*/@version) < 2.0)
            then [$1,"v1schema.xsd"] → validate-with-xml-schema() ≫ @1
            else [$1,"v2schema.xsd"] → validate-with-xml-schema() ≫ @1
          }
        → [$1,"stylesheet.xsl"] → xslt() ≫ $result

