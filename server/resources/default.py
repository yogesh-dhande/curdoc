import numpy as np
from bokeh.plotting import *
from bokeh.models import ColumnDataSource

def modify_doc(doc):

    # prepare some date
    N = 300
    x = np.linspace(0, 4*np.pi, N)
    y0 = np.sin(x)
    y1 = np.cos(x)

    # NEW: create a column data source for the plots to share
    source = ColumnDataSource(data=dict(x=x, y0=y0, y1=y1))

    TOOLS = "pan,wheel_zoom,box_zoom,reset,save,box_select,lasso_select"

    # create a new plot and add a renderer
    left = figure(tools=TOOLS, width=350, height=350, title=None)
    left.circle('x', 'y0', source=source)

    # create another new plot and add a renderer
    right = figure(tools=TOOLS, width=350, height=350, title=None)
    right.circle('x', 'y1', source=source)

    # put the subplots in a gridplot
    p = gridplot([[left, right]])

    doc.add_root(p)