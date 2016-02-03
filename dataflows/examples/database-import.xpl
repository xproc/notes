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

declare variable $xdb.user as external;
declare variable $xdb.password as external;
declare variable $xdb.host as external;
declare variable $xdb.port as external;

declare step my:insert-reports(
  $source as document-node()
) output ^count as xs:integer
{
   p:viewport($source,$match := "/s:aprs/s:report",
      function ($node) as node() {
         let $insert := ml:insert-document(
            $node, $user := $xdb.user, $password := $xdb.password,
            $host := $xdb.host, $port := $xdb.port,
            $uri := 'http://weather.milowski.com/station/' || $id || '/' || 
                $node/@received || '.xml')
            return <inserted/>
   }) =>
   p:count($match := "/s:aprs/inserted") => ^count
}

declare step my:update-positions(
  $source as document-node()
) output ^count as xs:integer
{
   p:xslt($source, doc("make-position-update.xsl")) =>
   p:viewport($match := "/queries/c:query",
      function ($node) as node() {
         let $doc := ml:adhoc-query(
              $node, $user := $xdb.user, $password := $xdb.password,
              $host := $xdb.host, $port := $xdb.port
            )
            return <query/>
   }) =>
   p:count($match := "/queries/query") => ^count
}


declare flow my:import(^source as document-node()) output ^records as xs:integer, ^positions as xs:integer {
  let $filtered := flow output ^subset as document-node() {
      p:delete(^source, $match := "/s:aprs/s:report[@type='encoded']") =>
      p:delete($match := "/s:aprs/s:report[@type='position']") =>
      p:delete($match := "/s:aprs/s:report[@error]") => ^subset
    }
    flow {
       $filtered^subset => my:insert-reports() => ^records ,
       $filtered^subset => my:update-positions() => ^positions
    }
}

flow output ^records as xs:integer, ^positions as xs:integer {
  my:import(doc("data.xml")) => ^result,^positions
}

