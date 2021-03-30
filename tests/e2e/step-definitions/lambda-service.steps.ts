import { binding, given, when, then, before } from 'cucumber-tsflow'
import { expect } from 'chai'
import axios from 'axios'
import { logger } from '../../../src/factory/LoggerFactory'

@binding()
export class LambdaServiceSteps {
  private responseBody: any
  private port: number
  private host: string
  private response: any

  @before()
  public beforeEach() {
    this.host = null
    this.port = null
    this.response = null
    this.responseBody = null
  }

  @given(/The lambda service is running on "([^"]*)" and port (\d*)/)
  public givenTheServiceIsRunning(host:string, port: number) {
    this.host = host
    this.port = port
  }

  @when(/I GET "([^"]*)"/)
  public async get(endpoint: string) {
    this.response = await axios.get(`http://${this.host}:${this.port}${endpoint}`, { headers: { 'content-type': 'application/json' } })
    .catch(error => logger.error(`Error thrown making GET request to http://${this.host}:${this.port}${endpoint}`, error))
    expect(this.response).to.not.be.null
    if (this.response && this.response.data) {
      expect(this.response.data).to.not.be.null
      this.responseBody = this.response.data
    }
  }

  @then(/response code should be (\d*)/)
  public responseCodeShouldBe(expectedResponseCode: string) {
    expect(this.response.status).to.eql(parseInt(expectedResponseCode))
  }

  @then(/response body key "([^"]*)" should contain value "([^"]*)"/)
  public responseBodyContains(bodyKey: string, bodyValue: string) {
    expect(this.responseBody[bodyKey].toString()).to.deep.equal(bodyValue)
  }
}