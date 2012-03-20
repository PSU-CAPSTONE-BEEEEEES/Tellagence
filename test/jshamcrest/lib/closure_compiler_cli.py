#!/usr/bin/env python
#-*- coding:utf-8 -*-

# Copyright (c) 2009, Daniel Fernandes Martins
# All rights reserved.
#
# Redistribution and use of this software in source and binary forms, with or
# without modification, are permitted provided that the following conditions
# are met:
#
# * Redistributions of source code must retain the above copyright notice, this
#   list of conditions and the following disclaimer.
#
# * Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.
#
# * Neither the author name nor the names of its contributors may be used to
#   endorse or promote products derived from this software without specific
#   prior written permission of the author.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.


import urllib
import urllib2
import sys


# Service location and supported options
_SERVICE_URL       = 'http://closure-compiler.appspot.com/compile'
_OUTPUT_INFO       = ('compiled_code', 'warnings', 'errors', 'statistics',)
_OUTPUT_FORMAT     = ('text', 'json', 'xml',)
_COMPILATION_LEVEL = {
    'whitespace': 'WHITESPACE_ONLY',
    'simple'    : 'SIMPLE_OPTIMIZATIONS',
    'advanced'  : 'ADVANCED_OPTIMIZATIONS',
}

# Error codes
_ERROR_SERVICE, _ERROR_INPUT = 1, 2


def compile_js(options):
    """
    Compiles JavaScript using the Google Closure Compiler service.
    """
    try:
        output = urllib2.urlopen(_SERVICE_URL, _build_request_params(options))
        print output.read()
    except:
        sys.exit(_ERROR_SERVICE)


def _build_request_params(options):
    """
    Prepares the service parameters.
    """
    data = {
        'output_info'      : options.info,
        'output_format'    : options.format,
        'compilation_level': _COMPILATION_LEVEL[options.level],
    }

    if options.url:
        data['code_url'] = options.url
    if options.file:
        data['js_code'] = file(options.file, 'r').read()

    return urllib.urlencode(data)


def main():
    """
    Main function.
    """
    import optparse
    p = optparse.OptionParser()

    # Required command line options
    p.add_option('--info'  , '-i', default='compiled_code',
        help="information to get from the compiler. Options: 'compiled_code' (default), 'warnings', 'errors', or 'statistics'")
    p.add_option('--format', '-o', default='text',
        help="output format. Options: 'text' (default), 'json', or 'xml'")
    p.add_option('--level' , '-l', default='simple',
        help="compilation level. Options: 'whitespace', 'simple' (default), or 'advanced'")
    p.add_option('--file'  , '-f',
        help="path to a javascript file")
    p.add_option('--url'   , '-u',
        help="URL of a javascript file that's available via HTTP")

    options = p.parse_args()[0]

    # Sanity check
    if options.info not in _OUTPUT_INFO or \
            options.format not in _OUTPUT_FORMAT or \
            options.level not in _COMPILATION_LEVEL or \
            (not options.file and not options.url):
        print "Invalid options."
        p.print_help()
        sys.exit(_ERROR_INPUT)
    else:
        compile_js(options)


if __name__ == '__main__':
    main()
