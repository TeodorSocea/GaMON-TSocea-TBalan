#!/bin/bash

git add .

# git -c user.name='Paul Draper' -c user.email='my@email.org' commit -m '...'

user='BalanTudor-Cristian'
email='balanache1234@gmail.com'

git -c user.name=$user -c user.email=$email commit -m "new"
git push --set-upstream origin balan