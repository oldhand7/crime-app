import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";



type EagerSubscriptionResponse = {
  readonly subscriptionID?: string | null;
  readonly end?: number | null;
}

type LazySubscriptionResponse = {
  readonly subscriptionID?: string | null;
  readonly end?: number | null;
}

export declare type SubscriptionResponse = LazyLoading extends LazyLoadingDisabled ? EagerSubscriptionResponse : LazySubscriptionResponse

export declare const SubscriptionResponse: (new (init: ModelInit<SubscriptionResponse>) => SubscriptionResponse)

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly lat?: number | null;
  readonly long?: number | null;
  readonly status?: string | null;
  readonly subscriptionID?: string | null;
  readonly dueDay?: string | null;
  readonly crimes?: (Crime | null)[] | null;
  readonly conversations?: (Message | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly lat?: number | null;
  readonly long?: number | null;
  readonly status?: string | null;
  readonly subscriptionID?: string | null;
  readonly dueDay?: string | null;
  readonly crimes: AsyncCollection<Crime>;
  readonly conversations: AsyncCollection<Message>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerCrime = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Crime, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly lat?: number | null;
  readonly long?: number | null;
  readonly reporterId: string;
  readonly reporter?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCrime = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Crime, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly lat?: number | null;
  readonly long?: number | null;
  readonly reporterId: string;
  readonly reporter: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Crime = LazyLoading extends LazyLoadingDisabled ? EagerCrime : LazyCrime

export declare const Crime: (new (init: ModelInit<Crime>) => Crime) & {
  copyOf(source: Crime, mutator: (draft: MutableModel<Crime>) => MutableModel<Crime> | void): Crime;
}

type EagerMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sender_id: string;
  readonly receiver_id: string;
  readonly text: string;
  readonly attachment_url?: string | null;
  readonly timestamp: string;
  readonly sender?: User | null;
  readonly receiver?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sender_id: string;
  readonly receiver_id: string;
  readonly text: string;
  readonly attachment_url?: string | null;
  readonly timestamp: string;
  readonly sender: AsyncItem<User | undefined>;
  readonly receiver: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage

export declare const Message: (new (init: ModelInit<Message>) => Message) & {
  copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}