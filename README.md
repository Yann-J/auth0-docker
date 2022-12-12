# Auth0 JWT Proxy

This simple app implements several useful HTTP endpoints needed in the Oauth2/JWT authentication flow.

- `/login`: will simply redirect to the appropriate Auth0 login page with all application-specific parameters (and save the Referer in a session cookie to redirect back to it after the completion of the authentication flow).
- `/callback`: the most important endpoint, in charge of validating the token passed by Auth0 to the browser by HTTP redirect, against the Auth0 servers, to retrieve a JWT token and save it in a cookie under your domain.
It also includes a basic UI to show your current login status, and the contents of your decoded JWT at `/user`.

It uses nodejs, passport, and the official Auth0 passport strategy.

## To run and use

Just run the docker image with the right environment variables:
```
docker run --name auth0-docker -e NAME=VALUE -e NAME2=VALUE2 ... yannj/auth0-docker
```

It will serve the application at [http://localhost:3000/](http://localhost:3000/).

The following variables may be used:

| Variable name | Required? | Purpose | Example |
|---|---|---|---|
|`AUTH0_CLIENT_ID`| Yes | Your Auth0 Client ID, from your application settings in Auth0 portal | `ypI8mltZkbAzb854T4RnzhjK8idFu2Y4` |
|`AUTH0_DOMAIN` | Yes | Your Auth0 domain | `mydomain.eu.auth0.com` |
|`AUTH0_CLIENT_SECRET` | Yes | Your client secret, used to validate the JWT token | `c-aZ9-dAmNzjT7c0D7yfxwZ4vo8n2e2te9_qEF5yX-XoSHjRcY64DgWLbPF8dkq3` |
|`AUTH0_CALLBACK_URL` | No | The default callback URL, defaults to '/callback' | `/` |
|`RETURN_URL` | No | The default URL to redirect back to after login, defaults to '/' | `/` |
|`SESSION_SECRET` | No | A random key used to encrypt the session cookie used to remember the original Referer | `wd#R%g45g` |
|`URL_CONTEXT` | No | A base URL under which to serve all the endpoints. Useful for reverse proxy setup. Defaults to root '/' | `/auth` |
|`COOKIE_NAME` | No | The name of the cookie to be used to save the JWT |

The server is intended to be run behind a proxy in order to be served inder the same domain as your application so it can share the cookie.

