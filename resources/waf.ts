export const waf = {
  Type: "AWS::WAFv2::WebACL",
  Properties: {
    Name: "${self:service}-${self:provider.stage}-waf-webacl",
    Scope: "REGIONAL",
    Description: "This is a ${self:service} web ACL with AWS Managed Rules",
    DefaultAction: {
      Allow: {},
    },
    VisibilityConfig: {
      SampledRequestsEnabled: true,
      CloudWatchMetricsEnabled: true,
      MetricName:
        "${self:service}-${self:provider.stage}-ApiGateway-HTTP-Flood-Prevent-Metric",
    },
    Rules: [
      {
        Name: "${self:service}-${self:provider.stage}-HTTP-Flood-Prevent-Rule",
        Priority: 1,
        Action: {
          Block: {},
        },
        VisibilityConfig: {
          SampledRequestsEnabled: true,
          CloudWatchMetricsEnabled: true,
          MetricName:
            "${self:service}-${self:provider.stage}-HTTP-Flood-Prevent-Rule-Metric",
        },
        Statement: {
          RateBasedStatement: {
            AggregateKeyType: "IP",
            Limit: 100,
          },
        },
      },
      {
        Name: "${self:service}-${self:provider.stage}-Prevent-Not-JP-Ip-Rule",
        Priority: 0,
        Statement: {
          NotStatement: {
            Statement: {
              GeoMatchStatement: {
                CountryCodes: ["JP"],
              },
            },
          },
        },
        Action: {
          Block: {},
        },
        VisibilityConfig: {
          SampledRequestsEnabled: true,
          CloudWatchMetricsEnabled: true,
          MetricName:
            "${self:service}-${self:provider.stage}-Prevent-Not-JP-Ip-Rule-Metric",
        },
      },
    ],
  },
};
