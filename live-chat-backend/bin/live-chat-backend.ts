#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LiveChatBackendStack } from '../lib/live-chat-backend-stack';

const app = new cdk.App();
new LiveChatBackendStack(app, 'LiveChatBackendStack');
