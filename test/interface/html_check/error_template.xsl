
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns="http://www.w3.org/TR/xhtml1/strict"
 xmlns:m="http://www.w3.org/2005/10/markup-validator"
 xmlns:env="http://www.w3.org/2003/05/soap-envelope"
>
  <xsl:output 
    method="text"
    omit-xml-declaration="yes"    
  />
  
  <xsl:param name="location" />

  <xsl:template match="/">
  <xsl:call-template name="divider" />
  <xsl:value-of select="//m:errorcount" />
  <xsl:text> Errors in </xsl:text>
  <xsl:value-of select="$location" />
  <xsl:call-template name="lb" />
    <xsl:apply-templates select="//m:error" />
  </xsl:template>


  <xsl:template match="m:error">
  <xsl:text> Line </xsl:text>
  <xsl:value-of select="m:line" />
  <xsl:text>, Col </xsl:text>
  <xsl:value-of select="m:col" />
  <xsl:text>:</xsl:text>
  <xsl:call-template name="lb" />
  <xsl:value-of select="m:message" />
  <xsl:call-template name="lb" />
  </xsl:template>
  
  <xsl:template name="lb"><xsl:text>
</xsl:text></xsl:template>

  <xsl:template name="divider">
    <xsl:text>--------------</xsl:text><xsl:call-template name="lb" />
  </xsl:template>
</xsl:stylesheet>
