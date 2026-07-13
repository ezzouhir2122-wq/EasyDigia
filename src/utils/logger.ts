const RESET = '\x1b[0m'
const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

export const logger = {
  info(msg: string): void {
    process.stdout.write(`${CYAN}[${timestamp()}] i ${msg}${RESET}\n`)
  },
  success(msg: string): void {
    process.stdout.write(`${GREEN}[${timestamp()}] v ${msg}${RESET}\n`)
  },
  warn(msg: string): void {
    process.stdout.write(`${YELLOW}[${timestamp()}] ! ${msg}${RESET}\n`)
  },
  error(msg: string): void {
    process.stdout.write(`${RED}[${timestamp()}] x ${msg}${RESET}\n`)
  },
  step(step: string, detail = ''): void {
    const suffix = detail ? ` - ${detail}` : ''
    process.stdout.write(`${CYAN}[${timestamp()}] > ${step}${suffix}${RESET}\n`)
  },
}
