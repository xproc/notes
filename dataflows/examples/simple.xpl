xproc version = "2.0";

(: A flow has some number of inputs and output and notionally executes as a flow
   graph.  Note that the inputs and outputs use a prefix of '^' for the variable
   name to keep in line with the XQuery grammar where keywords are undecorated
   and variable names are prefixed with '$'.  The choice of '^' is a bit
   arbitrary at this point.

   Constructing a flow is a "graph cutting" game where you can specify a sequence
   of chained steps and use variables to refer to other sequences, inputs, and
   outputs.

   In this example, the flow is a simple chaining of three steps.  The flow
   to be executed has a distinct signature of a single input and output
   document.  The flow itself is unnamed as no name is needed.
:)

flow (^source as document-node()) output ^result as document-node() {

   ^source
   => p:xinclude()
   => p:validate-with-xml-schema(doc("schema.xsd"))
   => p:xslt(doc("style.xsl")) => ^result
   
}
