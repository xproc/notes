xproc version = "2.0";

(: This is an example of declaring a flow (i.e., giving it a name).  Each
   step does a separate database load (insertion) task and just reports
   back a count to the using application.

   The flow ties these together into something that can be invoked.  A
   using application would call this flow by name to execute the import
   on a particular data set.

   We can also take advantage of external variable binding and to allow
   the database connection information to be global to the various
   steps.  This allows an application that embeds this pipeline to bind
   that sensitive data in the static context.

   At the bottom is an example of a default invocation.  Destructuring
   can provide the ability to bind outputs, in declaration order, to
   a list of output ports.  In this case, the names happen to match but
   that would not always be the case.
:)

import "marklogic.xpl";
namespace s="http://weather.milowski.com/V/APRS/";
namespace ml="http://xmlcalabash.com/ns/extensions/marklogic";

option $xdb.user as xs:string;
option $xdb.password as xs:string;
option $xdb.host as xs:string;
option $xdb.port as xs:string;

inputs $data as document-node();
outputs $records as xs:integer,
        $positions as xs:integer;
        

$data/s:aprs/s:report[@type != 'encoded']
 → $1/s:aprs/s:report[@type != 'position']
 → $1/s:aprs/s:report[not(@error)]
 ≫ $filtered

$filtered
 → replace (/s:aprs/s:report) {
     let $uri := 'http://weather.milowski.com/station/' ||
                 $1/*/@id || '/' || 
                 $1/*/@id/@received || '.xml'
     {                
       $1 → ml:insert-document(
              user=$xdb.user, password=$xdb.password,
              host=$xdb.host, port=$xdb.port,
              uri=$uri)
       data "text/xml" { <inserted/> } ≫ @1
     }
   }
 → $1/*/inserted → count() ≫ $records

$filtered
 → [$1,"make-position-update.xsl"] → xslt()
 → replace (/queries/query) {
   $1 → ml:adhoc-query(
          user=$xdb.user, password=$xdb.password,
          host=$xdb.host, port=$xdb.port)
      ≫ @1
   }
 → $1/*/query → count() ≫ $positions 

  
