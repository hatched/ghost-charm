# Overview

Ghost is an Open Source application which allows you to write
and publish your own blog, giving you the tools to make it easy
and even fun to do. It's simple, elegant, and designed so that
you can spend less time making your blog work and more time
blogging.

# Installation

To deploy this charm you will need at a minimum: a cloud environment, working Juju installation and a successful bootstrap. Once bootstrapped, deploy this charm:

    juju deploy ghost

And finally expose the Ghost service:

    juju expose ghost
    
Then get the public IP address for Ghost with

    juju status ghost
    
# Using Ghost

Visit `<your URL>:2368/ghost/signup/` to create your username and password. Continue setting up Ghost by following the [usage documentation](http://docs.ghost.org/usage/).

# Configuration

To view the configuration options for this charm:

    juju get ghost

To set a configuration option for this charm:

    juju set ghost <key>=<value>
