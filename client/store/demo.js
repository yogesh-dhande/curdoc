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
# Source: https://panel.holoviz.org/reference/templates/Bootstrap.html
import panel as pn
import numpy as np
import holoviews as hv

pn.extension(sizing_mode="stretch_width")

bootstrap = pn.template.BootstrapTemplate(title="Bootstrap Template")

xs = np.linspace(0, np.pi)
freq = pn.widgets.FloatSlider(name="Frequency", start=0, end=10, value=2)
phase = pn.widgets.FloatSlider(name="Phase", start=0, end=np.pi)


@pn.depends(freq=freq, phase=phase)
def sine(freq, phase):
    return hv.Curve((xs, np.sin(xs * freq + phase))).opts(
        responsive=True, min_height=400
    )


@pn.depends(freq=freq, phase=phase)
def cosine(freq, phase):
    return hv.Curve((xs, np.cos(xs * freq + phase))).opts(
        responsive=True, min_height=400
    )


bootstrap.sidebar.append(freq)
bootstrap.sidebar.append(phase)

bootstrap.main.append(
    pn.Row(
        pn.Card(hv.DynamicMap(sine), title="Sine"),
        pn.Card(hv.DynamicMap(cosine), title="Cosine"),
    )
)
bootstrap.servable()

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
