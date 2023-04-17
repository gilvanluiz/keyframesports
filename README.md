# Feature driven folder layout

The folder structure is broken down by feature rather than type.

App/ // Configuration and routing
Components/ // Components shared across features
Features/
Feature-name/
components/ // Components for feature
FeatureNameView.tsx
FeatureNameLayout.jsx
duck.js // See the next section
selector.js
Large-feature/ // Large Features can be nested
Feature-name/
...
Feature-name/
...
Utils/ // Non-React shared code
...

See [this article](https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84) for more discussion

### Ducks Redux Convention

See [here](https://github.com/erikras/ducks-modular-redux) for the ducks redux convention. If the single file grows too large, [reducks](https://github.com/alexnm/re-ducks) can be used.

## Side Effects in Redux

This project uses `redux-loop` for its side effects instead of `redux-thunk` or `redux-saga`. To understand how side effects are handled, check out the [docs](https://github.com/redux-loop/redux-loop).

# Secrets files

You will need 3 secrets files: .env.dev, .env.prod, and .env.staging.

The contents of these files are stored in the credentials repository.

# Deploying

NOTE: There is now a `yarn run deploy:prod` that should work. If it doesn't work, you may not have access on surge. In that case, tell Thomas what email account you use with Surge.

To deploy, you first need to make sure you have all deps installed with `yarn install`. Then build react with the URL set, and then deploy to surge:

```
REACT_APP_URL=https://api2.nextplay.tech yarn run build
```

Then run Surge and deploy. For staging, this is `surge ./build philaunion-prod.surge.sh`. For prod:

```
surge ./build philadelphiaunion.nextplay.tech
```
