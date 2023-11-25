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

### New server setup

Documentation for setting up a new server via [Digital Ocean](https://www.digitalocean.com) 
can be found in [this comment on issue #9](https://github.com/lando-systems/website/issues/9#issuecomment-1826195088)

### Files and host directory structure

The following files found in the `/server` directory are used to configure the web server:
- `httpd.conf` - Apache `httpd` configuration file
- `mime.types` - Apache `httpd` mime type definitions
- `compose.yaml` - Docker compose configuration for `httpd` web server container

The Docker compose configuration in `compose.yaml`:
- lives in `/srv/httpd` - the web server root directory on the host machine
- creates a container named `httpd` based on the standard [httpd image](https://hub.docker.com/_/httpd)
- exposes ports 80 and 443 on the host machine for non-ssl and ssl traffic respectively
- mounts **host** folders and files to the web server container
    - `/srv/httpd/logs` - the `httpd` log directory
    - `/srv/httpd/conf` - the `httpd` configuration directory
    - `/srv/httpd/html` - the `httpd` web document root, contains:
      - the static website files (everything under `/public`)
      - a `.well-known` directory for Let's Encrypt certificate verification

## Deployment

Working on it...
