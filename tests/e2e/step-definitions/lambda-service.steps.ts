import { binding, given, when, then, before } from 'cucumber-tsflow'
import { expect } from 'chai'
import axios from 'axios'

@binding()
export class LambdaServiceSteps {
  private requestBody: any
  private responseBody: any
  private port: number
  private host: string
  private response: any

  @before()
  public beforeEach() {
    this.requestBody = null
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

  @given(/I set the request body as "([^"]*)"/)
  public givenISetTheRequestBody(requestJsonBodyFilePath: string) {
    const content = require(`../resources/${requestJsonBodyFilePath}`)
    this.requestBody = JSON.stringify(content)
  }

  @when(/I POST to "([^"]*)"/)
  public async postTo(endpoint: string) {
    this.response = await axios.post(`http://${this.host}:${this.port}${endpoint}`, this.requestBody, { headers: { 'content-type': 'application/json' } })
    expect(this.response).to.not.be.null
    expect(this.response.data).to.not.be.null
    this.responseBody = this.response.data
  }

  @then(/response code should be (\d*)/)
  public responseCodeShouldBe(expectedResponseCode: string) {
    expect(this.response.status).to.eql(parseInt(expectedResponseCode))
  }

  @then(/response body key "([^"]*)" should contain value "([^"]*)"/)
  public responseBodyContains(bodyKey: string, bodyValue: string) {
    expect(this.responseBody[bodyKey]).to.deep.equal(bodyValue)
  }
}