/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSubscription = /* GraphQL */ `
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      id
      setupIntentId
      onCreateUser {
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
      onUpdateUser {
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
      onDeleteUser {
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
      onCreateCrime {
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
      onUpdateCrime {
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
      onDeleteCrime {
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
      onCreateMessage {
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
      onUpdateMessage {
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
      onDeleteMessage {
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
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
        startedAt
        __typename
      }
      conversations {
        nextToken
        startedAt
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
export const createCrime = /* GraphQL */ `
  mutation CreateCrime(
    $input: CreateCrimeInput!
    $condition: ModelCrimeConditionInput
  ) {
    createCrime(input: $input, condition: $condition) {
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
  }
`;
export const updateCrime = /* GraphQL */ `
  mutation UpdateCrime(
    $input: UpdateCrimeInput!
    $condition: ModelCrimeConditionInput
  ) {
    updateCrime(input: $input, condition: $condition) {
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
export const deleteCrime = /* GraphQL */ `
  mutation DeleteCrime(
    $input: DeleteCrimeInput!
    $condition: ModelCrimeConditionInput
  ) {
    deleteCrime(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
