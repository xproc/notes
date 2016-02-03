xproc version = "2.0";

(: This is an alternate version of database-import.xpl that uses only flows. :)

declare variable $xdb.user as external;
declare variable $xdb.password as external;
declare variable $xdb.host as external;
declare variable $xdb.port as external;

declare flow my:insert-reports(
  ^source as document-node()
) output ^count as xs:integer
{
   ^source => p:viewport($match := "/s:aprs/s:report",
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

declare flow my:update-positions(
  ^source as document-node()
) output ^count as xs:integer
{
   ^source => p:xslt(doc("make-position-update.xsl")) =>
   p:viewport(match="/queries/c:query",
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
       $filtered^subset => my:insert-reports() => ^records },
       $filtered^subset => my:update-positions() => ^positions
    }
}

flow output ^records as xs:integer, ^positions as xs:integer {
  my:import(doc("data.xml")) => ^result,^positions
}

