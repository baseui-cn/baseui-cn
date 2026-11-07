#!/usr/bin/env node
import { createProgram } from "./program"

createProgram()
  .version("1.5.0")
  .parseAsync()
  .catch((error: Error) => {
    console.error(`\n${error.message}\n`)
    process.exitCode = 1
  })
