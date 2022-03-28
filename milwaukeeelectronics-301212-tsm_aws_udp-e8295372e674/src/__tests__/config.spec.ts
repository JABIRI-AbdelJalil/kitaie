'use strict'

import { Config } from "../config"

it('Should detect missing env variables', () => {

  // When none of the correct fields are provided.
  expect(Config._missingEnvVariables({}).sort()).toEqual(Config._requiredFields.sort());
  expect(Config._missingEnvVariables({'notAField': 3, 'alsoNotAField': 'dummy'}).sort()).toEqual(Config._requiredFields.sort());

  // Detects port and host correctly.
  const emptyList: string[] = [];
  expect(Config._missingEnvVariables({'PORT': '8080', 'HOST':'127.0.0.1'})).toEqual(emptyList);
  expect(Config._missingEnvVariables({'PORT': 8080, 'HOST':'127.0.0.1'})).toEqual(emptyList);

  // Programmatically check required Env variables
  const requiredFieldsDummy = Config._requiredFields.reduce((acc, curr) => {return {...acc, [curr]: 'dummy'}}, {});
  expect(Config._missingEnvVariables(requiredFieldsDummy)).toEqual([]);
})