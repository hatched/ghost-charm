# Overview

Ghost is an Open Source application which allows you to write and publish your
own blog, giving you the tools to make it easy and even fun to do. It's simple,
elegant, and designed so that you can spend less time making your blog work and
more time blogging.

This Ghost charm allows you to trivially deploy a horizontally scalable, load
balanced, instance of the Ghost blogging platform locally or on a cloud
provider of choice using Juju.

To deploy this charm you will need a cloud environment, a working Juju
installation and a successful bootstrap. If you don't have Juju installed and an
environment set up see
[Getting Started With Juju](https://jujucharms.com/docs/getting-started).

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Using A Load Balancer](#using-a-load-balancer)
- [Setting Up Email Service](#setting-up-email-service)
- [Connecting To Mysql](#connecting-to-mysql)
- [Horizontal Scaling](#horizontal-scaling)
- [Colocating On A Single Machine](#colocating-on-a-single-machine)
- [Deploying And Using The GUI](#deploying-and-using-the-gui)
- [Contributing](#contributing)
- [Bug Reports](#bug-reports)

# Quick Start

After you have a Juju cloud environment running:

    $ juju deploy ghost
    $ juju expose ghost

To access your newly installed blog you'll need to get the IP of the instance.

    $ juju status ghost

Visit `<your URL>:2368/ghost/signup/` to create your username and password.
Continue setting up Ghost by following the
[usage documentation](http://docs.ghost.org/usage/).

You will want to change the URL that Ghost uses to generate links internally to
the URL you will be using for your blog.

    $ juju set ghost url=<your url>

The ghost charm is designed to not run as a user which has access to reserved
ports. This means that if you want to run your blog on port 80 or 443 you will
need to deploy and relate this charm to Apache. This has the added benefit of
being able to load balance between any additional Ghost units and do url
redirection if necessary. See
[Using A Load Balancer](#using-a-load-balancer) for more information.

In order to allow Ghost to send emails for things like new user validation and
password resets you will want to set up the email service. See
[Setting Up Email Service](#setting-up-email-service) for more information.

It's also recommended, although not required, that you use a MySQL database
instead of the internal SQLite database. See
[Connecting To MySQL](#connecting-to-mysql) for more information.

All of the instructions in this readme are provided using Juju's CLI interface.
Juju also has an amazing GUI which is highly recommended for beginners to Juju.
For information on how to deploy the GUI and use it with this charm see
[Deploying And Using The GUI](#deploying-and-using-the-gui)

# Configuration

To view the configuration options for this charm open the `config.yaml` file or:

    $ juju get ghost

To set a configuration option for this charm:

    $ juju set ghost <key>=<value>

See the `config.yaml` file in the charm for a detailed list of all of the charms
configuration options.


# Using A Load Balancer

In order to run multiple instances of the Ghost web server and to be able to
serve your blog on a reserved port this charm supports being load balanced and
reverse proxied by [haproxy](https://jujucharms.com/haproxy/trusty).

In order to reverse proxy and load balance this service you will need to deploy
haproxy:

    $ juju deploy haproxy
    $ juju expose haproxy

You will then need to unexpose the Ghost service:

    $ juju unexpose ghost

You now need to let your haproxy instance know about Ghost so that it can
make the appropriate adjustments.

    $ juju add-relation ghost haproxy

After a few moments of configuration your Ghost blog will now be reachable on
port 80 and you will be able to horizontally scale the server and have it
automatically load balanced. See [Horizontal Scaling](#horizontal-scaling) for
more information.


# Setting Up Email Service

Ghost needs the ability to send emails to users for things like new user
validation and password resets. To accomplish this Ghost supports using a
third party email service which it can communicate with to send these emails.
Ghost, and this charm, supports sending emails using Mailgun, Amazon SES, and
Gmail. Additional information about why Ghost needs this service and it's
supported platforms see [Mail configuration](http://support.ghost.org/mail/).

To specify a supported email service to use you simply need to set the
configuration values in the charm and they will be generated for your Ghost
instance.

#### Mailgun & Gmail

    $ juju set ghost mailserver_username=<your username>
    $ juju set ghost mailserver_password=<your password>
    Then
    $ juju set ghost mail_service=Mailgun
    -or-
    $ juju set ghost mail_service=Gmail

#### Amazon SES

    $ juju set ghost mailserver_username=<your username>
    $ juju set ghost mailserver_password=<your password>
    $ juju set ghost amazon_ses_host=<your ses host>
    Then
    $ juju set ghost mail_service=SES

After this has been completed your Ghost server will restart and Ghost will
now be able to send emails using that provider. It's recommended to test this
before you need it by creating a new user and pointing it to an email you
control and ensure that you get the validation email.


# Connecting To MySQL

By default this charm uses Ghost's built in SQLite storage. If you would like to
horizontally scale your ghost instance you will need to use an external database
like MySQL.

**If you already have blog posts in the SQLite database they will not be
deleted, but you will have to manually port them over to the MySQL database.**

First you will need to deploy MySQL into your Juju environment:

    $ juju deploy mysql

Additional details about the MySQL charm and configuration can be found in the
[MySQL charm details](https://jujucharms.com/mysql/precise/) page.

You'll then need to relate the Ghost blog service to the MySQL service.

    $ juju add-relation ghost mysql

The charm will then handle setting up all configuration options necessary to use
the MySQL database instead of the internal SQLite database.


# Horizontal Scaling

If you're getting a lot of traffic to your blog and find that your webserver
instance is maxing out it's resources you can trivially scale horizontally. To
add additional units (instances):

    $ juju add-unit -n 1 ghost

Now that you have more than one unit you will need to ensure your posts are not
stored locally on a single unit and you will need to be able to load balance
between the multiple instances. See
[Using A Load Balancer](#using-a-load-balancer) and
[Connecting To MySQL](#connecting-to-mysql) for more information.


# Colocating On A Single Machine

By default, every time you deploy a service or create a new unit Juju will
create a new instance on your cloud provider. This may be undesired due to
hardware availability or budgeting. Juju also provides you an easy to use method
to deploy all of these services to a smaller number of machines using the
following syntax:

    $ juju deploy --to=<machine number> <service name>

    ex)

    $ juju deploy --to=1 ghost

Colocating can have unintended consequences if the multiple service were not
designed to be deployed to the same machine. To get around this you're able to
create LXC and KVM containers to deploy to. This gets into advanced Juju usage
and more information can be found in the Juju documentation on
[Deploying Charms](https://jujucharms.com/docs/charms-deploying#deploying-to-specific-machines-and-containers)

# Deploying And Using The GUI

Juju has a powerful graphical user interface which you can use to interact with
your environment without having to use the CLI. In order to use the GUI in
your environment you will need to deploy it:

    $ juju deploy juju-gui

Every command in this readme can be done using the GUI instead of the CLI. See
[Juju GUI](https://jujucharms.com/juju-gui/trusty) for detailed information on
the Juju GUI charm and how to use the GUI.


# Contributing

This charm wouldn't be where it is today without great contributions from
others. Pull requests are accepted in the
[ghost-charm repository](https://github.com/hatched/ghost-charm)


# Bug Reports

Please file bugs for the Ghost blogging engine in the
[TryGhost Ghost repository](https://github.com/TryGhost/Ghost) and not in the
ghost-charm repository.

If you have found a bug with the ghost-charm itself they can be filed in the
[ghost-charm repository](https://github.com/hatched/ghost-charm). Please include
exact steps to reproduce the issue and be as detailed as possible, including
what version of Ubuntu you're running on, the version of this charm you have
deployed, the cloud your environment is running on, any other charms deployed to
the environment.
