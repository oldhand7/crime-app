// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Crime, Message, SubscriptionResponse } = initSchema(schema);

export {
  User,
  Crime,
  Message,
  SubscriptionResponse
};