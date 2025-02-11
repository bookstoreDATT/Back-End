import 'dotenv/config';
import Joi from 'joi';

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(80),
        HOSTNAME: Joi.string().default('127.0.0.1'),
        MONGODB_URL_DEV: Joi.string().description('Local Mongo DB'),
        MONGODB_URL_CLOUD: Joi.string().description('Cloud Mongo DB'),
        JWT_ACCESS_TOKEN_KEY: Joi.string().required().description('JWT Access Token Key'),
        JWT_ACCESS_EXPIRATION: Joi.string().default('15m').description('minutes after which access tokens expire'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    port: envVars.PORT,
    hostname: envVars.HOSTNAME,
    mongoose: {
        url: envVars.MONGODB_URL_DEV,
        options: {
            dbName: 'DATT',
        },
    },
    jwt: {
        accessTokenKey: envVars.JWT_ACCESS_TOKEN_KEY,
        verifyExpiration: envVars.JWT_VERIFY_EXPIRATION,
    },
};

export default config;
