#!/usr/bin/env node
import { createProgram } from "./program"

createProgram().parseAsync().catch((error: Error) => {
  console.error(`\n${error.message}\n`)
  process.exitCode = 1
})
