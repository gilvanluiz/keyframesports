## Feature driven folder layout

The folder structure is broken down by feature rather than type.

App/ // Configuration and routing
Components/ // Components shared across features
Features/
Feature-name/
Components/
FeatureNameView.jsx
FeatureNameLayout.jsx
duck.js // See the next section
selector.js
Large-feature/
Feature-name/
...
Feature-name/
...
utils/ // Non-React shared code
...

See [this article](https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84) for more discussion

### Ducks Redux Convention

See [here](https://github.com/erikras/ducks-modular-redux) for the ducks redux convention. If the single file grows too large, [reducks](https://github.com/alexnm/re-ducks) can be used.

## Side Effects in Redux

This project uses `redux-loop` for its side effects instead of `redux-thunk` or `redux-saga`. To understand how side effects are handled, check out the [docs](https://github.com/redux-loop/redux-loop).
