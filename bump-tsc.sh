#!/usr/bin/env bash

for d in . examples/*
do
    yarn --cwd "$d" add typescript@"$1"
done