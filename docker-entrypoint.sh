#!/bin/sh

# Replace environment variables on template and create js file
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js

# Starts NGINX
exec nginx -g 'daemon off;'