/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const id = /* GraphQL */ `
  subscription Id {
    id
  }
`;
export const setupIntentId = /* GraphQL */ `
  subscription SetupIntentId {
    setupIntentId
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      name
      image
      firstName
      lastName
      lat
      long
      status
      subscriptionID
      dueDay
      crimes {
        nextToken
        __typename
      }
      messages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      name
      image
      firstName
      lastName
      lat
      long
      status
      subscriptionID
      dueDay
      crimes {
        nextToken
        __typename
      }
      messages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      name
      image
      firstName
      lastName
      lat
      long
      status
      subscriptionID
      dueDay
      crimes {
        nextToken
        __typename
      }
      messages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateCrime = /* GraphQL */ `
  subscription OnCreateCrime($filter: ModelSubscriptionCrimeFilterInput) {
    onCreateCrime(filter: $filter) {
      id
      title
      content
      lat
      long
      reporterId
      reporter {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCrime = /* GraphQL */ `
  subscription OnUpdateCrime($filter: ModelSubscriptionCrimeFilterInput) {
    onUpdateCrime(filter: $filter) {
      id
      title
      content
      lat
      long
      reporterId
      reporter {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCrime = /* GraphQL */ `
  subscription OnDeleteCrime($filter: ModelSubscriptionCrimeFilterInput) {
    onDeleteCrime(filter: $filter) {
      id
      title
      content
      lat
      long
      reporterId
      reporter {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
      id
      sender_id
      receiver_id
      text
      attachment_url
      timestamp
      sender {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      receiver {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
      id
      sender_id
      receiver_id
      text
      attachment_url
      timestamp
      sender {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      receiver {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
    onDeleteMessage(filter: $filter) {
      id
      sender_id
      receiver_id
      text
      attachment_url
      timestamp
      sender {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      receiver {
        id
        name
        image
        firstName
        lastName
        lat
        long
        status
        subscriptionID
        dueDay
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
