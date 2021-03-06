// @flow
type RetryFunction<T> = () => Promise<T>
type RetryOptions = {
  retries?: number,
  maxTimeout?: number
}

type FetchOptions = {
  body?: any,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

export interface Now {
  retry<T>(fn: RetryFunction<T>, options?: RetryOptions): Promise<T>,
  create(paths: string[], createArgs: Object): Promise<NewDeployment>,
  fetch(url: string, options?: FetchOptions): Promise<any>,
  list(appName: string, {version: number}): Deployment[],
}

export interface Output {
  debug(msg: string): void,
  error(msg: string, slug?: string): void,
  log(msg: string): void,
  note(msg: string): void,
  print(msg: string): void,
  success(msg: string): void,
  warn(msg: string): void,
}

export type User = {
  uid: string,
  email: string,
  username: string,
  avatar: string
}

export type Config = {
  alias?: string[] | string,
  aliases?: string[] | string,
  name?: string,
}

export interface CLIContext {
  authConfig: {
    credentials: Array<{
      provider: 'sh',
      token: string,
    }>,
  },
  argv: string[],
  apiUrl: string,
  config: {
    updateChannel: string,
    type: string,
    files: string[],
    forwardNpm: boolean,
    sh: {
      user: {
        uid: string,
        email: string,
        username: string,
        avatar: string
      },
      currentTeam: {
        id: string,
        slug: string,
        name: string,
        creatorId: string,
        avatar: string,
      }
    }
  },
}

export type Scale = {
  min: number,
  max: number
}

export type ScaleArgs = {
  min: number,
  max: number | 'auto'
}

export type DeploymentScale = {
  [dc: string]: Scale
}

export type DeploymentScaleArgs = {
  [dc: string]: ScaleArgs
}

export type InstancesCount = {
  [dc: string]: number,
}

export type DeploymentLimits = {
  maxConcurrentReqs: number,
  timeout: number,
  duration: number
}

export type NpmDeployment = {
  uid: string,
  url: string,
  name: string,
  type: 'NPM',
  state: 'INITIALIZING' | 'FROZEN' | 'READY' | 'ERROR',
  created: number,
  creator: { uid: string },
  sessionAffinity: string,
  scale: DeploymentScale
}

export type StaticDeployment = {
  uid: string,
  url: string,
  name: string,
  type: 'STATIC',
  state: 'INITIALIZING' | 'FROZEN' | 'READY' | 'ERROR',
  created: number,
  creator: { uid: string },
  sessionAffinity: string,
}

export type DockerDeployment = {
  uid: string,
  url: string,
  name: string,
  type: 'DOCKER',
  state: 'INITIALIZING' | 'FROZEN' | 'READY' | 'ERROR',
  created: number,
  creator: { uid: string },
  sessionAffinity: string,
  scale: DeploymentScale,
  limits?: DeploymentLimits,
  slot?: string
}

export type Deployment =
  NpmDeployment |
  StaticDeployment |
  DockerDeployment

export type PathAliasRule = {
  pathname: string,
  method: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>,
  dest: string,
}

export type Alias = {
  uid: string,
  alias: string,
  created: string,
  deployment: {
    id: string,
    url: string
  },
  creator: {
    uid: string,
    username: string,
    email: string
  },
  deploymentId: string,
  rules?: PathAliasRule[]
}

export type AliasRecord = {
  uid: string,
  alias: string,
  created?: string,
  oldDeploymentId?: string
}

export type PathRule = {
  dest: string,
  pathname?: string,
  method?: Array<string>,
}

export type DNSRecord = {
  id: string,
  creator: string,
  mxPriority?: number,
  name: string,
  priority?: number,
  slug: string,
  type: string,
  value: string,
  created: number,
  updated: number
}

export type Certificate = {
  uid: string,
  autoRenew: boolean,
  cns: string[],
  created: string,
  expiration: string
}

export type Domain = {
  aliases: string[],
  boughtAt?: string,
  cdnEnabled: boolean,
  certs: string[],
  created: string,
  expiresAt: string,
  serviceType: 'zeit.world' | 'external',
  name: string,
  verified: boolean,
}

export type AddedDomain = {
  ns: string[],
  created: string,
  verified: boolean,
}

export type DomainPrice = {
  period: number,
  price: number,
}

export type CreditCard = {
  id: string,
  address_city: string,
  address_country: string,
  address_line1_check: string,
  address_line1: string,
  address_line2: string,
  address_state: string,
  address_zip_check: string,
  address_zip: string,
  brand: string,
  country: string,
  customer: string,
  cvc_check: string,
  exp_month: number,
  exp_year: number,
  fingerprint: string,
  last4: string,
  name: string,
  object: string,
}

export type InstancesInfo = {
  [dc: string]: {
    instances: Array<{}>
  }
}

type GenericEvent<T, P> = {
  type: T,
  created: number,
  payload: P
}

export type StateChangeEvent = GenericEvent<'state-change', {
  dc?: 'sfo1' | 'bru1',
  value: 'INITIALIZING' | 'READY' | 'ERROR' | 'FROZEN'
}>

export type BuildStartEvent = GenericEvent<'build-start', {
}>

export type BuildCompleteEvent = GenericEvent<'build-complete', {
  dc: 'sfo1' | 'bru1'
}>

export type InstanceStartEvent = GenericEvent<'instance-start', {
  dc: 'sfo1' | 'bru1',
  billingId: string
}>

export type InstanceStopEvent = GenericEvent<'instance-stop', {
  dc: 'sfo1' | 'bru1',
  billingId: string
}>

export type AliasSetEvent = GenericEvent<'alias-add', {
  dc: 'sfo1' | 'bru1',
  billingId: string,
  aliasId: string,
  alias: string,
  teamId: string,
  userId: string,
  routes: null,
  url: string,
  oldDeploymentId: string,
}>

export type ScaleSetEvent = GenericEvent<'scale-set', {
  scalingRules: DeploymentScale,
  id: string,
  url: string,
  userId: string,
  teamId: string,
  min: number,
  max: number,
}>

export type CommandEvent = GenericEvent<'command', {
  deploymentId: string,
  instanceId: string,
  text: string,
  appName: string,
  id: string,
  seq: string,
  date: number,
  pid: string,
  serial: string
}>

export type StdoutEvent = GenericEvent<'stdout', {
  deploymentId: string,
  instanceId: string,
  text: string,
  appName: string,
  id: string,
  seq: string,
  date: number,
  pid: string,
  serial: string
}>

export type StderrEvent = GenericEvent<'stderr', {
  deploymentId: string,
  instanceId: string,
  text: string,
  appName: string,
  id: string,
  seq: string,
  date: number,
  pid: string,
  serial: string
}>

export type ExitEvent = GenericEvent<'exit', {
  date: number,
  pid: string,
  seq: string,
  text: string,
  id: string,
  deploymentId: string,
  appName: string,
  serial: string,
}>

export type DeploymentEvent =
  StateChangeEvent |
  BuildStartEvent |
  BuildCompleteEvent |
  InstanceStartEvent |
  InstanceStopEvent |
  AliasSetEvent |
  ScaleSetEvent |
  CommandEvent |
  StdoutEvent |
  StderrEvent |
  ExitEvent

export type NewDeployment = {
  deploymentId: string,
  url: string,
  scale: DeploymentScale,
  nodeVersion: string,
  readyState: 'INITIALIZING' | 'READY',
  blob?: null
}

export type CLIOptions<T> = {
  '--help'?: string,
  '--debug'?: string,
  '--token'?: string,
  '--team'?: string,
  '--local-config'?: string,
  '--global-config'?: string,
  '--api'?: string,
} & T

export type CLIAliasOptions = CLIOptions<{
  '--json': boolean,
  '--no-verify': boolean,
  '--rules': string,
  '--yes': boolean,
}>

export type CLICertsOptions = CLIOptions<{
  '--overwrite': string,
  '--crt': string,
  '--key': string,
  '--ca': string,
}>

export type CLIScaleOptions = CLIOptions<{
  '--no-verify': string,
}>

export type CLIDomainsOptions = CLIOptions<{
  '--cdn': boolean,
  '--no-cdn': boolean,
  '--coupon': string,
  '--external': boolean,
  '--yes': boolean,
}>

export type CLIDNSOptions = CLIOptions<{
}>
