#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApigwRestApiBasicAuthnStack } from '../lib/apigw-rest-api-basic-authn-stack';

const app = new cdk.App();
new ApigwRestApiBasicAuthnStack(app, 'ApigwRestApiBasicAuthnStack');
