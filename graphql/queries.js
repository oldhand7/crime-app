/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const rangeSearchCrimes = /* GraphQL */ `
  query RangeSearchCrimes($long_min: Float!, $long_max: Float!) {
    rangeSearchCrimes(long_min: $long_min, long_max: $long_max) {
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
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      }
      nextToken
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCrime = /* GraphQL */ `
  query GetCrime($id: ID!) {
    getCrime(id: $id) {
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
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listCrimes = /* GraphQL */ `
  query ListCrimes(
    $filter: ModelCrimeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCrimes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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

        }
        createdAt
        updatedAt
  
      }
      nextToken
    }
  }
`;
export const syncCrimes = /* GraphQL */ `
  query SyncCrimes(
    $filter: ModelCrimeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCrimes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        content
        lat
        long
        reporterId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
        _version
        _deleted
        _lastChangedAt
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
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
  ) {
    listMessages(filter: $filter, limit: $limit) {
      items {
        id
        sender_id
        receiver_id
        text
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
        }
        receiver{
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
        }
        attachment_url
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const syncMessages = /* GraphQL */ `
  query SyncMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMessages(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        sender_id
        sender{
          id
          name
        }
        
        receiver_id
        receiver{
          id
          name
        }
        text
        attachment_url
        timestamp
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const crimesByIdAndReporterId = /* GraphQL */ `
  query CrimesByIdAndReporterId(
    $id: ID!
    $reporterId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCrimeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    crimesByIdAndReporterId(
      id: $id
      reporterId: $reporterId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        content
        lat
        long
        reporterId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const messagesById = /* GraphQL */ `
  query MessagesById(
    $id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesById(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sender_id
        receiver_id
        text
        attachment_url
        timestamp
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
