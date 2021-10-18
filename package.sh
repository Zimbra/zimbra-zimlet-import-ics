#!/bin/bash

npm install
zimlet build
zimlet package -v 0.0.1 --zimbraXVersion ">=2.0.0" -n "zimbra-zimlet-import-ics" --desc "Adds a button in the calendar actions menu to import an event from ics." -l "Import event from ICS"
