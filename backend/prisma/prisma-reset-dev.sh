#!/bin/bash
prisma delete --env-file ../../config/dev.env
prisma deploy --env-file ../../config/dev.env