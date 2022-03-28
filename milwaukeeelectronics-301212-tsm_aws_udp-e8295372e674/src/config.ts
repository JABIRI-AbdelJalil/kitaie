'use strict'
const dotenv = require('dotenv');

export interface IConfig {
  port: number;
  host: string;
  apiUrl: string;
  cloudwatchLogsGroupName: string;
  cloudwatchLogsStreamName: string;
  cloudwatchLogsRegion: string;
}

/**
 * Config is a wrapper class for accessing the
 * config information retrieved from environment
 * variables. The environment variables can be set
 * in two ways.
 *   1. A ".env" file in the root of the app. This is
 *      typically used in dev environments
 *   2. By setting system env variables. This is typically
 *      used in deployed environments
 */
export class Config {
  static _requiredFields: string[] = [
    'PORT',
    'HOST',
    'API_URL',
    'CLOUDWATCH_LOGS_GROUP_NAME',
    'CLOUDWATCH_LOGS_STREAM_NAME',
    'CLOUDWATCH_LOGS_REGION'
  ];

  /**
   * Check that all required environment variables are found in by Dotenv
   * 
   * @param parsedEnvironment - The environment variables detected by Dotenv
   */
  static _missingEnvVariables(parsedEnvironment: object): string[] {
    const missingFields = Config._requiredFields.filter(field => !Object.keys(parsedEnvironment).includes(field));

    // Check that all fields had a match
    return missingFields;
  }

  /**
   * Returns the config values.
   */
  static get(): IConfig {
    // Maybe a better strategy is to always check for an ".env" file by
    //     using dotenv optimistically, and then falling back to 
    switch(process.env.NODE_ENV) {
      case 'dev':
        return {
          ...this._getFromEnvFile()
        }
      default:
        return {
          ...this._getFromEnvVariables()
        }
    }
  }

  /**
   * Retrieve ENV variables from ENV variables
   * (as opposed to a .env file). This function
   * is likely to be used in deployed environments,
   * whereas .env might be used in dev environments.
   */
  static _getFromEnvVariables(): IConfig {

    if(!process.env.PORT) {
      throw `Missing env variable: PORT`
    }

    if(!process.env.HOST) {
      throw `Missing env variable: HOST`
    }

    if(!process.env.API_URL) {
      throw 'Missing env variable: API_URL'
    }

    if(!process.env.CLOUDWATCH_LOGS_GROUP_NAME) {
      throw 'Missing env variable: API_URL'
    }

    if(!process.env.CLOUDWATCH_LOGS_REGION) {
      throw 'Missing env variable: CLOUDWATCH_LOGS_REGION'
    }

    if(!process.env.CLOUDWATCH_LOGS_STREAM_NAME) {
      throw 'Missing env variable: CLOUDWATCH_LOGS_STREAM_NAME'
    }

    let port;

    try {
      port = parseInt(process.env.PORT!);
    } catch(err) {
      throw `Could not parse int from PORT env variable`;
    }

    let host = process.env.HOST;
    let apiUrl = process.env.API_URL;
    let cloudwatchLogsGroupName = process.env.CLOUDWATCH_LOGS_GROUP_NAME;
    let cloudwatchLogsRegion = process.env.CLOUDWATCH_LOGS_REGION;
    let cloudwatchLogsStreamName = process.env.CLOUDWATCH_LOGS_STREAM_NAME;
    
    return {
      port,
      host,
      apiUrl,
      cloudwatchLogsGroupName,
      cloudwatchLogsRegion,
      cloudwatchLogsStreamName
    }
  }

  /**
   * Retrieves env variables from the
   * ".env" file.
   */
  static _getFromEnvFile(): IConfig {
    const configResult = dotenv.config();

    /**
     * Check whether env variables were properly instantiated
     */
    if(configResult.error) {
      throw configResult.error;
    }

    const missingFields: string[] = Config._missingEnvVariables(configResult.parsed);

    if(0 < missingFields.length) {
      throw `Error: Missing environment variables: ${missingFields}`;
    }

    try {
      const port = parseInt(configResult.parsed.PORT);
      const host = configResult.parsed.HOST!;
      const apiUrl = configResult.parsed.API_URL!;
      const cloudwatchLogsGroupName = process.env.CLOUDWATCH_LOGS_GROUP_NAME!;
      const cloudwatchLogsRegion = process.env.CLOUDWATCH_LOGS_REGION!;
      const cloudwatchLogsStreamName = process.env.CLOUDWATCH_LOGS_STREAM_NAME!;

      return {
        port,
        host,
        apiUrl,
        cloudwatchLogsGroupName,
        cloudwatchLogsRegion,
        cloudwatchLogsStreamName
      }
    } catch(err) {
      throw `Unable to parse environment variables.`;
    }
  }
}

export default Config;


