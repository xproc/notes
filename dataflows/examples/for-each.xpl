
("d1.xml","d2.xml","d3.xml") ! { [$1,"schema.xsd"] → validate-with-xml-schema() }

- or -
("d1.xml","d2.xml","d3.xml") ≫ $input
...
$input ! { [$1,"schema.xsd"] → validate-with-xml-schema() } 