#!/usr/bin/env node
import { createProgram } from "./program"

createProgram()
  .version("1.4.2")
  .parseAsync()
  .catch((error: Error) => {
    console.error(`\n${error.message}\n`)
    process.exitCode = 1
  })
