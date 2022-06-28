import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** Mongo object id scalar type */
  ObjectId: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AddMessageInput = {
  chatId?: InputMaybe<Scalars['ObjectId']>;
  recipients: Array<Scalars['ObjectId']>;
  text: Scalars['String'];
};

export type AuthUser = {
  __typename?: 'AuthUser';
  isAuth: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type Chat = {
  __typename?: 'Chat';
  _id: Scalars['ObjectId'];
  group: Group;
  messages: Array<Message>;
  users: Array<User>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  admins: Array<User>;
  image?: Maybe<Image>;
  name: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  _id: Scalars['ObjectId'];
  publicId: Scalars['String'];
  url: Scalars['String'];
};

export type LoggedInUser = {
  __typename?: 'LoggedInUser';
  token: Scalars['String'];
  user: User;
};

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ObjectId'];
  createdAt: Scalars['DateTime'];
  sender: User;
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage: Chat;
  createUser: User;
  deleteProfileImage: User;
  updateUser: User;
  uploadProfileImage: User;
};


export type MutationAddMessageArgs = {
  chatData: AddMessageInput;
};


export type MutationCreateUserArgs = {
  newUser: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  description: Scalars['String'];
  fullname: Scalars['String'];
};


export type MutationUploadProfileImageArgs = {
  file: Scalars['Upload'];
};

export type NewMessage = {
  __typename?: 'NewMessage';
  chatId: Scalars['ObjectId'];
  message: Message;
};

export type NewUser = {
  __typename?: 'NewUser';
  _id: Scalars['ObjectId'];
  fullname: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAuthUser: AuthUser;
  getChat: Chat;
  getChats: Array<Chat>;
  getUser: User;
  getUsers: Array<User>;
  loginUser: LoggedInUser;
};


export type QueryGetChatArgs = {
  recipientUsername: Scalars['String'];
};


export type QueryGetUserArgs = {
  username: Scalars['String'];
};


export type QueryGetUsersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  searchText: Scalars['String'];
};


export type QueryLoginUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newChat: Chat;
  newMessage: NewMessage;
  newUser: NewUser;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  description: Scalars['String'];
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  profileImg?: Maybe<Image>;
  username: Scalars['String'];
};

export type GetAuthUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthUserQuery = { __typename?: 'Query', getAuthUser: { __typename?: 'AuthUser', isAuth: boolean, user?: { __typename?: 'User', _id: any, email: string, username: string, fullname: string, description: string, profileImg?: { __typename?: 'Image', url: string } | null } | null } };

export type LoginUserQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserQuery = { __typename?: 'Query', loginUser: { __typename?: 'LoggedInUser', token: string, user: { __typename?: 'User', _id: any } } };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', _id: any } };

export type AddMessageMutationVariables = Exact<{
  chatData: AddMessageInput;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Chat', _id: any } };

export type GetChatQueryVariables = Exact<{
  recipientUsername: Scalars['String'];
}>;


export type GetChatQuery = { __typename?: 'Query', getChat: { __typename?: 'Chat', _id: any, users: Array<{ __typename?: 'User', _id: any, fullname: string }>, messages: Array<{ __typename?: 'Message', _id: any, text: string, sender: { __typename?: 'User', _id: any } }> } };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', getChats: Array<{ __typename?: 'Chat', _id: any, users: Array<{ __typename?: 'User', _id: any, username: string, fullname: string }>, messages: Array<{ __typename?: 'Message', _id: any, text: string }> }> };

export type GetFullUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetFullUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', _id: any, username: string, fullname: string, description: string } };

export type GetUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', _id: any, fullname: string } };

export type GetUsersQueryVariables = Exact<{
  searchText: Scalars['String'];
  offset: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', _id: any, username: string, fullname: string }> };

export type OnNewChatAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNewChatAddedSubscription = { __typename?: 'Subscription', newChat: { __typename?: 'Chat', _id: any, users: Array<{ __typename?: 'User', _id: any, username: string, fullname: string }>, messages: Array<{ __typename?: 'Message', _id: any, text: string, sender: { __typename?: 'User', _id: any } }> } };

export type OnNewMessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNewMessageAddedSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'NewMessage', chatId: any, message: { __typename?: 'Message', text: string, _id: any, sender: { __typename?: 'User', _id: any } } } };

export type OnNewUserAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNewUserAddedSubscription = { __typename?: 'Subscription', newUser: { __typename?: 'NewUser', _id: any, fullname: string, username: string } };

export type DeleteProfileImageMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteProfileImageMutation = { __typename?: 'Mutation', deleteProfileImage: { __typename?: 'User', _id: any, profileImg?: { __typename?: 'Image', _id: any } | null } };

export type UpdateUserMutationVariables = Exact<{
  fullname: Scalars['String'];
  description: Scalars['String'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', _id: any, fullname: string, description: string } };

export type UploadProfileImageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadProfileImageMutation = { __typename?: 'Mutation', uploadProfileImage: { __typename?: 'User', _id: any, profileImg?: { __typename?: 'Image', url: string } | null } };


export const GetAuthUserDocument = gql`
    query GetAuthUser {
  getAuthUser {
    isAuth
    user {
      _id
      email
      username
      fullname
      description
      profileImg {
        url
      }
    }
  }
}
    `;

/**
 * __useGetAuthUserQuery__
 *
 * To run a query within a React component, call `useGetAuthUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAuthUserQuery(baseOptions?: Apollo.QueryHookOptions<GetAuthUserQuery, GetAuthUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthUserQuery, GetAuthUserQueryVariables>(GetAuthUserDocument, options);
      }
export function useGetAuthUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthUserQuery, GetAuthUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthUserQuery, GetAuthUserQueryVariables>(GetAuthUserDocument, options);
        }
export type GetAuthUserQueryHookResult = ReturnType<typeof useGetAuthUserQuery>;
export type GetAuthUserLazyQueryHookResult = ReturnType<typeof useGetAuthUserLazyQuery>;
export type GetAuthUserQueryResult = Apollo.QueryResult<GetAuthUserQuery, GetAuthUserQueryVariables>;
export const LoginUserDocument = gql`
    query LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    user {
      _id
    }
    token
  }
}
    `;

/**
 * __useLoginUserQuery__
 *
 * To run a query within a React component, call `useLoginUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginUserQuery({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserQuery(baseOptions: Apollo.QueryHookOptions<LoginUserQuery, LoginUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
      }
export function useLoginUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginUserQuery, LoginUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
        }
export type LoginUserQueryHookResult = ReturnType<typeof useLoginUserQuery>;
export type LoginUserLazyQueryHookResult = ReturnType<typeof useLoginUserLazyQuery>;
export type LoginUserQueryResult = Apollo.QueryResult<LoginUserQuery, LoginUserQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($user: CreateUserInput!) {
  createUser(newUser: $user) {
    _id
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const AddMessageDocument = gql`
    mutation AddMessage($chatData: AddMessageInput!) {
  addMessage(chatData: $chatData) {
    _id
  }
}
    `;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      chatData: // value for 'chatData'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
export const GetChatDocument = gql`
    query GetChat($recipientUsername: String!) {
  getChat(recipientUsername: $recipientUsername) {
    _id
    users {
      _id
      fullname
    }
    messages {
      _id
      sender {
        _id
      }
      text
    }
  }
}
    `;

/**
 * __useGetChatQuery__
 *
 * To run a query within a React component, call `useGetChatQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatQuery({
 *   variables: {
 *      recipientUsername: // value for 'recipientUsername'
 *   },
 * });
 */
export function useGetChatQuery(baseOptions: Apollo.QueryHookOptions<GetChatQuery, GetChatQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatQuery, GetChatQueryVariables>(GetChatDocument, options);
      }
export function useGetChatLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatQuery, GetChatQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatQuery, GetChatQueryVariables>(GetChatDocument, options);
        }
export type GetChatQueryHookResult = ReturnType<typeof useGetChatQuery>;
export type GetChatLazyQueryHookResult = ReturnType<typeof useGetChatLazyQuery>;
export type GetChatQueryResult = Apollo.QueryResult<GetChatQuery, GetChatQueryVariables>;
export const GetChatsDocument = gql`
    query GetChats {
  getChats {
    _id
    users {
      _id
      username
      fullname
    }
    messages {
      _id
      text
    }
  }
}
    `;

/**
 * __useGetChatsQuery__
 *
 * To run a query within a React component, call `useGetChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetChatsQuery(baseOptions?: Apollo.QueryHookOptions<GetChatsQuery, GetChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatsQuery, GetChatsQueryVariables>(GetChatsDocument, options);
      }
export function useGetChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatsQuery, GetChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatsQuery, GetChatsQueryVariables>(GetChatsDocument, options);
        }
export type GetChatsQueryHookResult = ReturnType<typeof useGetChatsQuery>;
export type GetChatsLazyQueryHookResult = ReturnType<typeof useGetChatsLazyQuery>;
export type GetChatsQueryResult = Apollo.QueryResult<GetChatsQuery, GetChatsQueryVariables>;
export const GetFullUserDocument = gql`
    query GetFullUser($username: String!) {
  getUser(username: $username) {
    _id
    username
    fullname
    description
  }
}
    `;

/**
 * __useGetFullUserQuery__
 *
 * To run a query within a React component, call `useGetFullUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetFullUserQuery(baseOptions: Apollo.QueryHookOptions<GetFullUserQuery, GetFullUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFullUserQuery, GetFullUserQueryVariables>(GetFullUserDocument, options);
      }
export function useGetFullUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFullUserQuery, GetFullUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFullUserQuery, GetFullUserQueryVariables>(GetFullUserDocument, options);
        }
export type GetFullUserQueryHookResult = ReturnType<typeof useGetFullUserQuery>;
export type GetFullUserLazyQueryHookResult = ReturnType<typeof useGetFullUserLazyQuery>;
export type GetFullUserQueryResult = Apollo.QueryResult<GetFullUserQuery, GetFullUserQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($username: String!) {
  getUser(username: $username) {
    _id
    fullname
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($searchText: String!, $offset: Int!, $limit: Int!) {
  getUsers(searchText: $searchText, offset: $offset, limit: $limit) {
    _id
    username
    fullname
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      searchText: // value for 'searchText'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const OnNewChatAddedDocument = gql`
    subscription OnNewChatAdded {
  newChat {
    _id
    users {
      _id
      username
      fullname
    }
    messages {
      _id
      text
      sender {
        _id
      }
    }
  }
}
    `;

/**
 * __useOnNewChatAddedSubscription__
 *
 * To run a query within a React component, call `useOnNewChatAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewChatAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewChatAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnNewChatAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnNewChatAddedSubscription, OnNewChatAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewChatAddedSubscription, OnNewChatAddedSubscriptionVariables>(OnNewChatAddedDocument, options);
      }
export type OnNewChatAddedSubscriptionHookResult = ReturnType<typeof useOnNewChatAddedSubscription>;
export type OnNewChatAddedSubscriptionResult = Apollo.SubscriptionResult<OnNewChatAddedSubscription>;
export const OnNewMessageAddedDocument = gql`
    subscription OnNewMessageAdded {
  newMessage {
    chatId
    message {
      text
      _id
      sender {
        _id
      }
    }
  }
}
    `;

/**
 * __useOnNewMessageAddedSubscription__
 *
 * To run a query within a React component, call `useOnNewMessageAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewMessageAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewMessageAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnNewMessageAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnNewMessageAddedSubscription, OnNewMessageAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewMessageAddedSubscription, OnNewMessageAddedSubscriptionVariables>(OnNewMessageAddedDocument, options);
      }
export type OnNewMessageAddedSubscriptionHookResult = ReturnType<typeof useOnNewMessageAddedSubscription>;
export type OnNewMessageAddedSubscriptionResult = Apollo.SubscriptionResult<OnNewMessageAddedSubscription>;
export const OnNewUserAddedDocument = gql`
    subscription OnNewUserAdded {
  newUser {
    _id
    fullname
    username
  }
}
    `;

/**
 * __useOnNewUserAddedSubscription__
 *
 * To run a query within a React component, call `useOnNewUserAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewUserAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewUserAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnNewUserAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnNewUserAddedSubscription, OnNewUserAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewUserAddedSubscription, OnNewUserAddedSubscriptionVariables>(OnNewUserAddedDocument, options);
      }
export type OnNewUserAddedSubscriptionHookResult = ReturnType<typeof useOnNewUserAddedSubscription>;
export type OnNewUserAddedSubscriptionResult = Apollo.SubscriptionResult<OnNewUserAddedSubscription>;
export const DeleteProfileImageDocument = gql`
    mutation DeleteProfileImage {
  deleteProfileImage {
    _id
    profileImg {
      _id
    }
  }
}
    `;
export type DeleteProfileImageMutationFn = Apollo.MutationFunction<DeleteProfileImageMutation, DeleteProfileImageMutationVariables>;

/**
 * __useDeleteProfileImageMutation__
 *
 * To run a mutation, you first call `useDeleteProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProfileImageMutation, { data, loading, error }] = useDeleteProfileImageMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProfileImageMutation, DeleteProfileImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProfileImageMutation, DeleteProfileImageMutationVariables>(DeleteProfileImageDocument, options);
      }
export type DeleteProfileImageMutationHookResult = ReturnType<typeof useDeleteProfileImageMutation>;
export type DeleteProfileImageMutationResult = Apollo.MutationResult<DeleteProfileImageMutation>;
export type DeleteProfileImageMutationOptions = Apollo.BaseMutationOptions<DeleteProfileImageMutation, DeleteProfileImageMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($fullname: String!, $description: String!) {
  updateUser(fullname: $fullname, description: $description) {
    _id
    fullname
    description
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      fullname: // value for 'fullname'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UploadProfileImageDocument = gql`
    mutation UploadProfileImage($file: Upload!) {
  uploadProfileImage(file: $file) {
    _id
    profileImg {
      url
    }
  }
}
    `;
export type UploadProfileImageMutationFn = Apollo.MutationFunction<UploadProfileImageMutation, UploadProfileImageMutationVariables>;

/**
 * __useUploadProfileImageMutation__
 *
 * To run a mutation, you first call `useUploadProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProfileImageMutation, { data, loading, error }] = useUploadProfileImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadProfileImageMutation, UploadProfileImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProfileImageMutation, UploadProfileImageMutationVariables>(UploadProfileImageDocument, options);
      }
export type UploadProfileImageMutationHookResult = ReturnType<typeof useUploadProfileImageMutation>;
export type UploadProfileImageMutationResult = Apollo.MutationResult<UploadProfileImageMutation>;
export type UploadProfileImageMutationOptions = Apollo.BaseMutationOptions<UploadProfileImageMutation, UploadProfileImageMutationVariables>;