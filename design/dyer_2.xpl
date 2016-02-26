<?xml version='1.0'?>
<!DOCTYPE p:pipeline SYSTEM "../../../lib/xml/xproc.dtd" [
<!ATTLIST p:pipeline xmlns:c CDATA #IMPLIED>
]>
<p:pipeline xmlns:p="http://www.w3.org/ns/xproc" xmlns:c="http://www.w3.org/ns/xproc-step" exclude-inline-prefixes="my c p" xmlns:my="http://www.ltg.ed.ac.uk/~ht/" version="2.0" name="main">
 <!-- Needs XProc 2 to allow maps as values, variables to use local context
      and AVTs in options -->
 <p:option name="language" required="true"/>
 <p:option name="match" required="true"/>
 <p:option name="attr" required="true"/>

 <p:declare-step name="dyer" type="my:dyer">
  <p:documentation>
   <p>Internationalised colour lightener:  Converts all colours found
 in a specified attribute of a specified match in the source document which
 are also found in the map specified by the lex option</p>
  </p:documentation>
  <p:input kind="document" port="source" primary="true"/>
  <p:output port="result" primary="true"/>
  <p:option name="match">
   <p:documentation>
    <p>A match pattern which identifies the elements to be changed</p>
   </p:documentation>
  </p:option>
  <p:option name="attr">
   <p:documentation>
    <p>The attribute whose value is to be changed</p>
   </p:documentation>
  </p:option>
  <p:option name="lex">
   <p:documentation>
    <p>A map keyed by colour names with values the corresponding
       lighter ones</p>
   </p:documentation>
  </p:option>
  <p:viewport match="{$match}">
   <p:variable name="ca" select="/*/@{$attr}"/>
   <p:choose>
    <p:when test="$lex($ca)">
     <p:set-attributes match=".">
      <p:input port="attributes">
       <!-- note the p:make-attribute function would need to be defined,
              either primitively (XSLT and XQuery have their own
		variants of this, or just using XQuery? -->
        <x>
         {p:make-attribute($attr, $lex($ca))}
        </x>
      </p:input>
     </p:set-attributes>
    </p:when>
    <p:otherwise>
     <p:identity/>
    </p:otherwise>
   </p:choose>
  </p:viewport>
 </p:declare-step>

  <p:load name="ll" href="{$language}.json" override-content-type="application/json">
    <p:documentation>
     <p>Maps dark colour names to lighter ones.  Structure is like this:</p>
     <pre>
      {"language" : "...",
       "colourMap" : { "[dark name]" : "[lighter name]",
                        ... }}
     </pre>
    </p:documentation>
  </p:load>
 <p:jsonToXDM>
  <p:documentation>
   <p>A new step which converts an application/json document to an XDM
      item (array, map or literal)</p>
  </p:documentation>
 </p:jsonToXDM>
  <p:variable name="lexmap" select="?colourMap">
  </p:variable>
  <my:dyer match="{$match}" lex="{$lexmap}" attr="{$attr}"/>
 
</p:pipeline>
