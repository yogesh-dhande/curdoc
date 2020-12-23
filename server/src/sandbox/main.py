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
project_id = args.get('project', [b'default'])[0].decode("utf-8").split("/")[0]
print(project_id)
doc.title = project_id

print(sys.path)
sys.path.append("projects")
filepath = os.path.join("projects", project_id + '.py')
print(filepath)

with open(filepath, 'r') as code_file:
    for line in code_file.readlines():
        doc.add_root(Div(text=line))

# module = importlib.import_module(f'.{project_id}', package='projects')
# modify_doc = getattr(module, 'modify_doc', False)
# assert modify_doc

# modify_doc(doc)
