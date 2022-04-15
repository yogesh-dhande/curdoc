export const starterCode = `
from bokeh.io import curdoc
from bokeh.models.widgets import Div

curdoc().add_root(Div(text="Hello World"))
`;

export const starterBokehCode = `
# Source: https://docs.bokeh.org/en/latest/docs/user_guide/categorical.html
from bokeh.layouts import column
from bokeh.models import Slider
from bokeh.plotting import figure
from bokeh.io import curdoc

plot = figure(plot_width=400, plot_height=400)
r = plot.circle(
    [
        1,
        2,
        3,
        4,
        5,
    ],
    [3, 2, 5, 6, 4],
    radius=0.2,
    alpha=0.5,
)

slider = Slider(title="Size", start=0.1, end=0.5, step=0.01, value=0.2)


def update_glyph(attr, old, new):
    r.glyph.radius = new


slider.on_change("value", update_glyph)

curdoc().add_root(column(slider, plot))
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
