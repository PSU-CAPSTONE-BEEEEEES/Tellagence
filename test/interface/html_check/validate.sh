#!/bin/sh
#
# Script to validate files in directory
#
# Shamelessly stolen and modified from:
# http://www.contentwithstyle.co.uk/content/a-mass-validation-shellscript/

is_html() {
  file=$1 
  htmlstart=`grep '<html' $1`

  if [ "$htmlstart" != "" ]; 
  then 
    echo "1";
  fi
}

validate_file() {
  curl -s -F uploaded_file=@$1 -F output=soap12 http://validator.w3.org/check
}

download_site() {
  cd temp
  echo 'downloading files ...'
  wget -r -q -k -x -E -l 0 $1
  echo 'done downloading files'
  cd ..
}

setup() {
  rm -f log.txt
  rm -Rf temp
  mkdir temp
  touch log.txt
}

run_validation() {
  for file in `find $2`;
    do 
      htmltrue=`is_html $file`

      if [ "$htmltrue" = "1" ];
      then
        echo "request validation: $file"
        rpc=`validate_file $file`
      
        echo "checking response: $file"
        noerror=`echo $rpc | grep '<m:errorcount>0</m:errorcount>'`

        if [ "$noerror" = "" ];
        then
    filelocation=`echo $file | sed "s/\/\//\//g"`
          echo $rpc > temp_error.xml
          xsltproc --stringparam location $filelocation error_template.xsl temp_error.xml >> log.txt
          rm temp_error.xml

          echo "Error in file $file"
        fi
      fi
    done;
  
  has_errors=`cat ./log.txt | grep Error`
      
  if [ "$has_errors" = "" ];
  then
    echo "no errors found\n" >> log.txt
    cat log.txt
    exit 0;
  else
    cat log.txt
    exit 1;
  fi
}

####
# tried adapting to css validator on w3c with no luck so far

validate_css() {
  css_file=`echo $1`
  curl -s -F text=@$css_file -F output=soap12 http://jigsaw.w3.org/css-validator/validator
}

run_validation_css() {
  for file in `find $2`;
    do 
        echo "request validation: $file"
        rpc=`validate_css $file`
	echo $rpc
        echo "checking response: $file"
        noerror=`echo $rpc | grep '<m:errorcount>0</m:errorcount>'`

        if [ "$noerror" = "" ];
        then
          echo $rpc >> log.txt
        fi
    done;
}

####

setup
download_site $1
run_validation ./temp/ $1
