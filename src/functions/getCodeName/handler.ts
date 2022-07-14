import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getGptData } from "./getGptData";
import { prompt } from "./prompt";

const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const hint = event?.queryStringParameters?.hint ?? "こんにちは世界";
  const fullPrompt = `${prompt}${hint}\n`;

  const result = await getGptData(fullPrompt);
  return formatJSONResponse({
    data: result,
  });
};

export const main = middyfy(handler);
