#-*- coding:utf-8 -*-

"""JsHamcrest build script.
"""

import re
import cStringIO as StringIO

from fabric.api import *


# Project
env.project   = 'jshamcrest'
env.version   = '0.6.7'
env.full_name = '%s-%s' % (env.project, env.version)

# Build output
env.build_dir     = 'build'
env.dist_dir      = 'dist'
env.rev_info_file = '%s/_rev_info.txt' % (env.build_dir,)

# Output script files
env.js             = '%s/%s.js' % (env.build_dir, env.project)
env.js_version     = '%s/%s.js' % (env.build_dir, env.full_name)
env.js_min         = '%s/%s-min.js' % (env.build_dir, env.project)
env.js_min_version = '%s/%s-min.js' % (env.build_dir, env.full_name)

# Test
env.test_dir    = 'test'
env.web_browser = 'firefox'

# Documentation
env.doc_dir      = 'doc'
env.doc_build    = '%s/_build' % env.doc_dir
env.doc_dir_html = '%s/html'  % env.doc_build
env.doc_dir_pdf  = '%s/latex' % env.doc_build
env.doc_pdf      = '%s/JsHamcrest.pdf' % env.doc_dir_pdf
env.doc_remote   = '/home/destaquenet/public_html'

# Source code
env.src_dir   = 'src'
env.src_files = (
    'jshamcrest',
    'core',
    'number',
    'text',
    'object',
    'collection',
    'operator',
    'integration',
)

# Remote server
env.hosts = ['destaquenet.com']

# Constants
_PATTERN_COMMIT_HASH = re.compile('commit\W+([0-9a-f]+)')
_PATTERN_COMMIT_DATE = re.compile('Date:\W+(.*)')


@runs_once
def clean():
    """Resets the build output directories.
    """
    local('rm -fR %s %s' % (env.build_dir, env.dist_dir))
    local('mkdir -p %s %s' % (env.build_dir, env.dist_dir))

@runs_once
def build():
    """Builds the final script and writes it to the disk.
    """
    _set_revision_info()
    _replace_tokens()
    content = env.src_content.readlines()
    file(env.js, 'w').writelines(content)
    local('cp %s %s' % (env.js, env.js_version))
        
@runs_once
def pack():
    """Creates a minified version of the final script using the Google Closure
    Compiler service.
    """
    build()
    local('python lib/closure_compiler_cli.py -f %s > %s' % (env.js, env.js_min))
    local('cp %s %s' % (env.js_min, env.js_min_version))

def test():
    """Opens the test suite on a web browser.
    """
    pack()
    web_browser = prompt('Please choose your web browser', \
            default=env.web_browser)
    local('%s %s/testSuite.html &' % (web_browser, env.test_dir))

@runs_once
def doc_clean():
    """Resets the doc output directories.
    """
    local('cd %s; make clean;' % env.doc_dir)

def doc_html():
    """Builds the HTML documentation.
    """
    doc_clean()
    local('cd %s; make html' % env.doc_dir)

def doc_pdf():
    """Builds the PDF documentation.
    """
    doc_clean()
    local('cd %s; make latex' % env.doc_dir)
    local('cd %s; make all-pdf' % env.doc_dir_pdf)

def doc():
    """Builds the documentation both in HTML and PDF.
    """
    doc_clean()
    doc_html()
    doc_pdf()

def zip_doc():
    """Creates a zip file with the complete documentation.
    """
    pack()
    doc()
    local('cp %s %s' % (env.doc_pdf, env.doc_dir_html))
    local('cp %s %s' % (env.js, env.doc_dir_html))
    local('cp %s %s' % (env.js_min, env.doc_dir_html))
    local('cd %s; cp -R html %s; zip -r9 %s.zip %s' %
            ((env.doc_build,) + (env.project,) * 3))

def deploy():
    """Deploys the website.
    """
    zip_doc()
    put('%s/%s.zip' % (env.doc_build, env.project), env.doc_remote)
    run('cd %s; rm -R %s; unzip %s.zip; rm %s.zip' %
            ((env.doc_remote,) + (env.project,) * 3))

def _set_revision_info():
    """Reads information about the latest revision.
    """
    clean()
    local('git rev-list --all --max-count=1 --pretty > %s' % env.rev_info_file)
    rev_info = file(env.rev_info_file, 'r').read()
    env.commit_hash = _PATTERN_COMMIT_HASH.findall(rev_info)[0]
    env.commit_date = _PATTERN_COMMIT_DATE.findall(rev_info)[0]

def _read_files():
    """Reads and joins the source files.
    """
    env.src_content = StringIO.StringIO()
    for file_name in env.src_files:
        file_path = '%s/%s.js' % (env.src_dir, file_name)
        env.src_content.writelines(file(file_path, 'r').readlines())

def _replace_tokens():
    """Replaces the tokens found in the source code.
    """
    _read_files()
    content = env.src_content.getvalue()
    env.src_content = StringIO.StringIO()

    content = content.replace('@VERSION', env.version)
    content = content.replace('@REV', env.commit_hash)
    content = content.replace('@DATE', env.commit_date)

    env.src_content.write(content)
    env.src_content.seek(0)
