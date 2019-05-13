#!/bin/bash
prisma delete --env-file ../../config/test.env
prisma deploy --env-file ../../config/test.env