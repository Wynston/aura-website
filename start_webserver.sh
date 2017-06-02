#!/bin/bash

PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games"

#This starts a webserver in a screen
# -S name of screen
# -d -m  is make it no matter what
# command of bash -c "RUN WHATEVER BASH HERE YOU WANT"
pushd /home/pi/gits/aura-website/src/html/
screen -S webserver -d -m bash -c "python -m SimpleHTTPServer 80"
popd
