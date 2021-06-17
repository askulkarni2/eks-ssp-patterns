import * as cdk from '@aws-cdk/core';

// SSP Lib
import * as ssp from '@shapirov/cdk-eks-blueprint'

// Team implementations
import * as team from '../teams'

export default class MultiRegionConstruct extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        // Setup platform team
        const accountID = process.env.CDK_DEFAULT_ACCOUNT!
        const platformTeam = new team.TeamPlatform(accountID)
        const teams: Array<ssp.Team> = [platformTeam];

        // AddOns for the cluster.
        const addOns: Array<ssp.ClusterAddOn> = [
            new ssp.NginxAddOn,
            new ssp.ArgoCDAddOn,
            new ssp.CalicoAddOn,
            new ssp.MetricsServerAddOn,
            new ssp.ClusterAutoScalerAddOn,
            new ssp.ContainerInsightsAddOn,
        ];

        const east = 'blueprint-us-east-2'
        new ssp.EksBlueprint(scope, { id: `${id}-${east}`, addOns, teams }, {
            env: { region: east }
        });

        const central = 'blueprint-us-central-2'
        new ssp.EksBlueprint(scope, { id: `${id}-${central}`, addOns, teams }, {
            env: { region: central }
        });

        const west = 'blueprint-us-west-2'
        new ssp.EksBlueprint(scope, { id: `${id}-${west}`, addOns, teams }, {
            env: { region: west }
        });
    }
}
