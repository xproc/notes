<?xml version='1.0'?>
<!DOCTYPE p:pipeline SYSTEM "../../../lib/xml/xproc.dtd" [
<!ATTLIST p:pipeline xmlns:c CDATA #IMPLIED>
]>
<p:pipeline xmlns:p="http://www.w3.org/ns/xproc"
  xmlns:c="http://www.w3.org/ns/xproc-step"
  exclude-inline-prefixes="my c p"
  xmlns:my="http://www.ltg.ed.ac.uk/~ht/" version="1.0" name="main">
 <!-- Needs XProc 2 to allow maps as values, variables to use local context
      and AVTs in options -->
 <p:option name="language" required="true"/>
 <p:option name="match" required="true"/>
 
 <p:declare-step name="dyer" type="my:dyer">
  <p:documentation>
   <p>Internationalised colour lightener:  Converts all colours found by a
specified match in the source document which are also found in the map
specified by the document on the lex port (see documentation below)</p>
  </p:documentation>
  <p:input kind="document" port="source" primary="true"/>
  <p:input kind="document" port="lex" primary="false">
   <p:documentation>
    <p>Maps dark colour names to lighter ones.  Structure is like this:</p>
    <pre>
     <x>
      <colour name="[dark name]" pale="[lighter  name]"/>
      <colour name="..." pale="..."/>
      ...
     </x>
    </pre>
   </p:documentation>
  </p:input>
  <p:output port="result" primary="true"/>
  <p:option name="match"/>
  <!-- Ideally I'd like to viewport over attributes themselves . . . -->
  <p:viewport match="//product[@colour]" name="pvp"> <!-- No way to do match="{$match}" in v1, so we weld in the match pattern :-( -->
   <p:variable name="ca" select="string(/*/@colour)"/> <!-- If we were iteratiing over attributes, this would just be select="." -->
   <p:variable name="hit" select="*/colour[@name=$ca]/@pale">
    <p:documentation>
     <p>Find a pale equivalent of the current colour, or the empty string, by
looking it up in the lexicon supplied</p>
    </p:documentation>
    <p:pipe port="lex" step="dyer"/>
   </p:variable>
   <p:choose>
    <p:when test="$hit=''">
     <p:identity/>
    </p:when>
    <p:otherwise>
     <p:documentation>
      <p>We have a match -- build a suitable input to the
add-attributes:attributes port</p>
     </p:documentation>
     <p:in-scope-names name="isv"/>
     <p:template name="ilt">
      <p:input port="source">
       <p:empty/>
      </p:input>
      <p:input port="parameters">
       <p:pipe port="result" step="isv"/>
      </p:input>
      <p:input port="template">
       <p:inline>
        <x colour="{$hit}"/>
       </p:inline>
      </p:input>
     </p:template>
     <p:set-attributes match="*">
      <p:input port="source">
       <p:pipe step="pvp" port="current"/>
      </p:input>
      <p:input port="attributes">
       <p:pipe step="ilt" port="result"/>
      </p:input>
     </p:set-attributes>
    </p:otherwise>
   </p:choose>
  </p:viewport>
 </p:declare-step>

 <p:documentation>
  <p>We take a language name and a match pattern from the command line</p>
 </p:documentation>
 <p:load name="ll">
  <p:documentation>
   <p>We construct the lexicon name from the language option</p>
  </p:documentation>
  <p:with-option name="href" select="concat($language,'.xml')"/>
 </p:load>
 <my:dyer>
  <p:input port="source">
   <p:pipe step="main" port="source"/>
  </p:input>
  <p:input port="lex">
   <p:pipe step="ll" port="result"/>
  </p:input>
  <p:with-option name="match" select="$match"/>
 </my:dyer>
 
</p:pipeline>
