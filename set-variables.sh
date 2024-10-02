#!/bin/sh

# Replace environment variables on the template and create the definitive config file.
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js