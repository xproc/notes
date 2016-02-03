xproc version = "2.0";

(: This example is from the XProc 1.0 specificaiton (example 3).

   The input document can be interogated via the input port within the
   if expression.  We would allow a limited amount of branching constructs
   but the expressions shouldn't be limited.

   Here we can see how the input on ^source maps to the conditional and
   the use in the alternate first steps.  
:)

flow (^source as document-node()) output ^result as document-node() {
  if (number(^source/*/@version) < 2.0) 
  then ^source => p:validate-with-xml-schema(doc("v1schema.xsd"))
  else ^source => p:validate-with-xml-schema(doc("v2schema.xsd")) 
  => p:xslt(doc("stylesheet.xsl")
  => ^result
}

