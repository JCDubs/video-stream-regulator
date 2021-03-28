jest.mock('@middy/core')
jest.mock('@middy/http-json-body-parser')
import { middyfy } from "../../../src/libs/lambda"
import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

describe("lambda middify helper", () => {

    const mockMiddy = { use: jest.fn() }
    const mockBodyParser = "Test mock body parser"
    
    test("middify calls axpected middy functions", () => {
        (middy as jest.Mock).mockReturnValue(mockMiddy);
        (middyJsonBodyParser as jest.Mock).mockReturnValue(mockBodyParser);
        const mockHandler = {}
        middyfy(mockHandler)
        expect(middy).toHaveBeenCalledWith(mockHandler)
        expect(mockMiddy.use).toHaveBeenCalledWith(mockBodyParser)
    })
})