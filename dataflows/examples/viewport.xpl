inputs $source as document-node();
outputs $result as document-node();


$source → replace (/doc/section) { [$1,"style.xsl"] → xslt() ≫ @1 } ≫ $result