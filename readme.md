# Description

This is the source code for the [lando.systems](https://lando.systems) website.

## Development

### Requirements

Technically, nothing is required for development other than a text editor and a browser.

### Setup

1. Clone this repository
2. (optional) Convert markdown posts in `/posts` to html in `/public/posts`
    1. Install [Node.js](https://nodejs.org/en/) if not already installed
    2. Open a terminal in the root of the repository
    3. Run `npm install`
    4. Run `npm run build/convert-posts.mjs`
3. Open a browser pointing to `index.html` in the root of the repository


## Server configuration

The `/server` directory contains configuration files for a dockerized [Apache httpd web server](https://httpd.apache.org/).

This configuration is used for the [lando.systems](https://lando.systems) website. As of Nov 2023, the site is hosted
on a [DigitalOcean](https://www.digitalocean.com/) droplet running Docker 23 on Ubuntu 22.

### Files and host directory structure
- `./server/httpd.conf` - Apache `httpd` configuration file
- `./server/mime.types` - Apache `httpd` mime type definitions
- `./server/compose.yaml` - Docker compose file for `httpd` web server container
  - creates a container named `httpd` based on the standard [httpd image](https://hub.docker.com/_/httpd)
  - exposes ports 80 and 443 on the host machine for non-ssl and ssl traffic respectively
  - mounts **host** folders and files to the web server container
    - `/srv/httpd` - the web server root directory, `compose.yaml` lives here
    - `/srv/httpd/logs` - the `httpd` log directory
    - `/srv/httpd/conf` - the `httpd` configuration directory, contains:
      - `httpd.conf`
      - `mime.types`
      - [Let's Encrypt](https://letsencrypt.org/) certificates created and renewed by [certbot](https://certbot.eff.org/)
    - `/srv/httpd/html` - the `httpd` web document root, contains:
      - the static website files (everything under `/public`)
      - a `.well-known` directory for Let's Encrypt certificate verification

### New server setup

TODO - document the initial web server configuration, what all needs to be done to spin up a new VM that can serve the site

## Deployment

Working on it...
