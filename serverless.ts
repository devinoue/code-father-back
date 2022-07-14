import type { AWS } from "@serverless/typescript";
import { waf } from "resources";
import getCodeName from "@functions/getCodeName";

const serverlessConfiguration: AWS = {
  service: "code-father",
  frameworkVersion: "3",
  plugins: [
    "serverless-associate-waf",
    "serverless-esbuild",
    "serverless-offline",
  ],

  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "ap-northeast-1",
    logRetentionInDays: 14,
    stage: '${opt:stage, "local"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      apiKeys: ["${self:service}-api"],
      usagePlan: {
        quota: {
          limit: 100,
          offset: 0,
          period: "DAY",
        },
        throttle: {
          burstLimit: 200,
          rateLimit: 100,
        },
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  resources: {
    Resources: {
      waf,
    },
  },
  // import the function via paths
  functions: { getCodeName },
  package: { individually: true },
  custom: {
    SECRET:
      "${self:custom.otherfile.environment.${self:provider.stage}.SECRET}",
    associateWaf: {
      name: "${self:resources.Resources.waf.Properties.Name}",
      version: "V2",
    },

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },

    otherfile: {
      environment: {
        local: "${file(.env.yml)}",
        dev: "${file(.env.yml)}",
        prod: "${file(.env.yml)}",
      },
    },
  },
};

module.exports = serverlessConfiguration;
