# Overview

Ghost is an Open Source application which allows you to write and publish your
own blog, giving you the tools to make it easy and even fun to do. It's simple,
elegant, and designed so that you can spend less time making your blog work and
more time blogging.

This Ghost charm allows you to trivially deploy a horizontally scalable, load
balanced, instance of the Ghost blogging platform locally or on a cloud
provider of choice.

To deploy this charm you will need a cloud environment, a working juju
installation and a successful bootstrap. If you don't have Juju installed and an
environment set up see [Getting Started With Juju](https://juju.ubuntu.com/docs/getting-started.html).

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Connecting To Mysql](#connecting-to-mysql)
- [Horizontal Scaling](#horizontal-scaling)
- [Load Balancing](#load-balancing)
- [Wrap Up](#wrap-up)
- [Contributing](#contributing)
- [Bug Reports](#bug-reports)

# Quick Start

    $ juju deploy ghost
    $ juju expose ghost

To access your newly installed blog you'll need to get the IP of the instance.

    $ juju status ghost

Visit `<your URL>:2368/ghost/signup/` to create your username and password.
Continue setting up Ghost by following the [usage documentation](http://docs.ghost.org/usage/).

You will want to change the URL that Ghost uses to generate links internally to
the URL you will be using for your blog.

    $ juju set ghost url=<your url>

If you will only be running a single instance of Ghost without any load
balancing or reverse proxy then you will also want to set the listening port.

    $juju set ghost port=80

It's also recommended, although not required, that you use a MySQL database
instead of the internal SQLite database. See [Connecting To MySQL](#connecting-to-mysql)
for more information.

# Configuration

To view the configuration options for this charm:

    $ juju get ghost

To set a configuration option for this charm:

    $ juju set ghost <key>=<value>

To set the URL which ghost uses when generating links:

    $ juju set ghost url=http://my-ghost-blog.com

To set the host to be passed to node's net.Server listen():

    $ juju set ghost host=0.0.0.0

To set the port to be passed to node's net.Server listen():

    $ juju set ghost port=2368

# Connecting To MySQL

By default this charm uses Ghost's built in SQLite storage. If you would like to
horizontally scale your ghost instance you will need to use an external database
like MySQL.

**If you already have blog posts in the SQLite database they will not be
deleted, but you will have to manually port them over to the MySQL database.**

First you will need to deploy MySQL into your Juju environment:

    $ juju deploy mysql

Additional details about the MySQL charm and configuration can be found in the
[MySQL charm details](http://manage.jujucharms.com/charms/precise/mysql) page.

You'll then need to relate the Ghost blog service to the MySQL service.

    $ juju add-relation ghost mysql

The charm will handle all settings necessary to use the MySQL database instead
of the internal SQLite database.

# Horizontal Scaling

If you're getting a lot of traffic to your blog and find that your webserver
instance is maxing out it's resources you can trivially scale horizontally. To
add additional units (instances):

    $ juju add-unit -n 1 ghost

Now that you have more than one unit you will need to load balance between
them. See [Load Balancing](#load-balancing) for more information.

# Load Balancing

This charm supports being load balanced and reverse proxied by [haproxy](http://manage.jujucharms.com/charms/precise/haproxy)
or [apache2](http://manage.jujucharms.com/charms/precise/apache2).

In order to load balance this service you will need to deploy one of the
aforementioned charms:

    $ juju deploy haproxy

You will then need to unexpose the Ghost service:

    $ juju unexpose ghost

And change the port at which it listens from 80:

    $ juju set ghost port=2368

You now need to let your haproxy instance know about Ghost so that it can
make the appropriate adjustments.

    $ juju add-relation ghost haproxy

# Contributing

This charm wouldn't be where it is today without great contributions from
others. Pull requests are accepted in the [ghost-charm repository](https://github.com/hatched/ghost-charm)

# Bug Reports

Please file bugs for the Ghost blogging engine in the
[TryGhost Ghost repository](https://github.com/TryGhost/Ghost) and not in the
ghost-charm repository.

If you have found a bug with the ghost-charm itself they can be filed in the
[ghost-charm repository](https://github.com/hatched/ghost-charm). Please include
exact steps to reproduce the issue and be as detailed as possible, including
what version of Ubuntu you're running, the version of this charm you have
deployed, the cloud your environment is running on, any other charms deployed to
the environment.
