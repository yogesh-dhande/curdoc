from random import random
import importlib
import os
import sys

from bokeh.layouts import column
from bokeh.models import Button
from bokeh.models import Div
from bokeh.palettes import RdYlBu3
from bokeh.plotting import figure, curdoc

doc = curdoc()

args = doc.session_context.request.arguments
print(args)
filename = args.get('filename', [b'default'])[0].decode("utf-8") 
print(filename)
doc.title = filename

sys.path.append(os.getcwd())
filepath = os.path.join('projects', filename + '.py')
assert os.path.exists(filepath)
with open(filepath, 'r') as code_file:
    for line in code_file.readlines():
        doc.add_root(Div(text=line))

module = importlib.import_module(f'.{filename}', package='projects')
modify_doc = getattr(module, 'modify_doc', False)
assert modify_doc


modify_doc(doc)
