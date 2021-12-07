export const starterBokehCode = `
from random import random

from bokeh.layouts import column
from bokeh.models import Button
from bokeh.palettes import RdYlBu3
from bokeh.plotting import figure, curdoc

# create a plot and style its properties
p = figure(x_range=(0, 100), y_range=(0, 100), toolbar_location=None)
p.border_fill_color = 'black'
p.background_fill_color = 'black'
p.outline_line_color = None
p.grid.grid_line_color = None

# add a text renderer to the plot (no data yet)
r = p.text(x=[], y=[], text=[], text_color=[], text_font_size="26px",
           text_baseline="middle", text_align="center")

i = 0

ds = r.data_source

# create a callback that adds a number in a random location
def callback():
    global i

    # BEST PRACTICE --- update .data in one step with a new dict
    new_data = dict()
    new_data['x'] = ds.data['x'] + [random()*70 + 15]
    new_data['y'] = ds.data['y'] + [random()*70 + 15]
    new_data['text_color'] = ds.data['text_color'] + [RdYlBu3[i%3]]
    new_data['text'] = ds.data['text'] + [str(i)]
    ds.data = new_data

    i = i + 1

# add a button widget and configure with the call back
button = Button(label="Press Me")
button.on_click(callback)

# put the button and plot in a layout and add to the document
curdoc().add_root(column(button, p))
`;

export const starterPanelCode = `
# Source: https://panel.holoviz.org/user_guide/APIs.html
import hvplot.pandas
import panel as pn
from bokeh.sampledata.autompg import autompg
import param

columns = list(autompg.columns[:-2])

def autompg_plot(x='mpg', y='hp', color='#058805'):
    return autompg.hvplot.scatter(x, y, c=color, padding=0.1)


class MPGExplorer(param.Parameterized):

    x = param.Selector(objects=columns)
    y = param.Selector(default='hp', objects=columns)
    color = param.Color(default='#0f0f0f')
    
    @param.depends('x', 'y', 'color') # optional in this case
    def plot(self):
        return autompg_plot(self.x, self.y, self.color)

explorer = MPGExplorer()

pn.Row(explorer.param, explorer.plot).servable()
`;

function generateId() {
  return Math.random().toString(16).slice(2);
}

const demoUserId = generateId();

const demoUser = {
  id: demoUserId,
  name: "guest",
};

const bokehProjectId = generateId();

const bokehProject = {
  demo: true,
  id: bokehProjectId,
  slug: "bokeh",
  user: demoUser,
  blob: [
    {
      fullPath: `${demoUserId}/projects/${bokehProjectId}/main.py`,
      relativePath: "main.py",
      text: starterBokehCode,
    },
  ],
};

const panelProjectId = generateId();

const panelProject = {
  demo: true,
  id: panelProjectId,
  slug: "panel",
  user: demoUser,
  blob: [
    {
      fullPath: `${demoUserId}/projects/${panelProjectId}/main.py`,
      relativePath: "main.py",
      text: starterPanelCode,
    },
  ],
};

export const demos = {
  bokeh: bokehProject,
  panel: panelProject,
  user: demoUser,
};
