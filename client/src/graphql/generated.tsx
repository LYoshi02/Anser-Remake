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
  chatId: Scalars['ObjectId'];
  text: Scalars['String'];
};

export type AddUsersToGroupInput = {
  chatId: Scalars['ObjectId'];
  newUsers: Array<Scalars['ObjectId']>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  isAuth: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type ChangeGroupNameArgs = {
  chatId: Scalars['ObjectId'];
  newName: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  _id: Scalars['ObjectId'];
  group?: Maybe<Group>;
  lastSeen: Array<UserLastSeen>;
  messages: Array<Message>;
  unreadMessages?: Maybe<Scalars['Float']>;
  users: Array<User>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type GetUsersInput = {
  excludedUsers?: InputMaybe<Array<Scalars['ObjectId']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  searchText: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  admins: Array<User>;
  image?: Maybe<Image>;
  name: Scalars['String'];
};

export type GroupOperationInput = {
  chatId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
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
  sender?: Maybe<User>;
  text: Scalars['String'];
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage: Chat;
  addUsersToGroup: Chat;
  appointAdmin: Chat;
  changeGroupName: Chat;
  createNewChat: Chat;
  createNewGroup: Chat;
  createUser: User;
  deleteGroupImage: Chat;
  deleteProfileImage: User;
  leaveGroup: Chat;
  loginUser: LoggedInUser;
  logout: Scalars['Boolean'];
  removeAdmin: Chat;
  removeFromGroup: Chat;
  setGroupImage: Chat;
  updateChatLastSeen: Scalars['Boolean'];
  updateUser: User;
  uploadProfileImage: User;
};


export type MutationAddMessageArgs = {
  chatData: AddMessageInput;
};


export type MutationAddUsersToGroupArgs = {
  addUsersArgs: AddUsersToGroupInput;
};


export type MutationAppointAdminArgs = {
  appointAdminArgs: GroupOperationInput;
};


export type MutationChangeGroupNameArgs = {
  changeGroupNameArgs: ChangeGroupNameArgs;
};


export type MutationCreateNewChatArgs = {
  chatData: NewChatInput;
};


export type MutationCreateNewGroupArgs = {
  groupData: NewGroupInput;
};


export type MutationCreateUserArgs = {
  newUser: CreateUserInput;
};


export type MutationDeleteGroupImageArgs = {
  chatId: Scalars['ObjectId'];
};


export type MutationLeaveGroupArgs = {
  chatId: Scalars['String'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveAdminArgs = {
  removeAdminArgs: GroupOperationInput;
};


export type MutationRemoveFromGroupArgs = {
  removeFromGroupArgs: GroupOperationInput;
};


export type MutationSetGroupImageArgs = {
  chatId: Scalars['ObjectId'];
  file: Scalars['Upload'];
};


export type MutationUpdateChatLastSeenArgs = {
  chatId: Scalars['ObjectId'];
};


export type MutationUpdateUserArgs = {
  description: Scalars['String'];
  fullname: Scalars['String'];
};


export type MutationUploadProfileImageArgs = {
  file: Scalars['Upload'];
};

export type NewChatInput = {
  recipients: Array<Scalars['ObjectId']>;
  text: Scalars['String'];
};

export type NewGroupInput = {
  groupName: Scalars['String'];
  groupUsers: Array<Scalars['ObjectId']>;
};

export type NewMessage = {
  __typename?: 'NewMessage';
  chatId: Scalars['ObjectId'];
  group?: Maybe<Group>;
  message: Message;
  users?: Maybe<Array<User>>;
};

export type Query = {
  __typename?: 'Query';
  getAuthUser: AuthUser;
  getChats: Array<Chat>;
  getGroupChat: Chat;
  getGroupData: Chat;
  getSingleChat: SingleChat;
  getUser: User;
  getUsers: Array<User>;
};


export type QueryGetGroupChatArgs = {
  chatId: Scalars['ObjectId'];
};


export type QueryGetGroupDataArgs = {
  chatId: Scalars['String'];
};


export type QueryGetSingleChatArgs = {
  recipientUsername: Scalars['String'];
};


export type QueryGetUserArgs = {
  username: Scalars['String'];
};


export type QueryGetUsersArgs = {
  searchOptions: GetUsersInput;
};

export type SingleChat = {
  __typename?: 'SingleChat';
  chat?: Maybe<Chat>;
  recipient: User;
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: NewMessage;
  newUser: User;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  description: Scalars['String'];
  email: Scalars['String'];
  fullname: Scalars['String'];
  isNewUser?: Maybe<Scalars['Boolean']>;
  profileImg?: Maybe<Image>;
  username: Scalars['String'];
};

export type UserLastSeen = {
  __typename?: 'UserLastSeen';
  date: Scalars['DateTime'];
  user: User;
};

export type GetAuthUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthUserQuery = { __typename?: 'Query', getAuthUser: { __typename?: 'AuthUser', isAuth: boolean, user?: { __typename?: 'User', _id: any, email: string, username: string, fullname: string, description: string, profileImg?: { __typename?: 'Image', url: string } | null } | null } };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'LoggedInUser', token: string, user: { __typename?: 'User', _id: any, email: string, username: string, fullname: string, description: string, profileImg?: { __typename?: 'Image', url: string } | null } } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', _id: any } };

export type AddMessageMutationVariables = Exact<{
  chatData: AddMessageInput;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Chat', _id: any } };

export type CreateNewChatMutationVariables = Exact<{
  chatData: NewChatInput;
}>;


export type CreateNewChatMutation = { __typename?: 'Mutation', createNewChat: { __typename?: 'Chat', _id: any } };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', getChats: Array<{ __typename?: 'Chat', _id: any, unreadMessages?: number | null, users: Array<{ __typename?: 'User', _id: any, username: string, fullname: string, profileImg?: { __typename?: 'Image', url: string } | null }>, messages: Array<{ __typename?: 'Message', _id: any, text: string, sender?: { __typename?: 'User', _id: any } | null }>, group?: { __typename?: 'Group', name: string, admins: Array<{ __typename?: 'User', _id: any }>, image?: { __typename?: 'Image', url: string } | null } | null }> };

export type GetFullUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetFullUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', _id: any, username: string, fullname: string, description: string, profileImg?: { __typename?: 'Image', url: string } | null } };

export type GetGroupChatQueryVariables = Exact<{
  chatId: Scalars['ObjectId'];
}>;


export type GetGroupChatQuery = { __typename?: 'Query', getGroupChat: { __typename?: 'Chat', _id: any, users: Array<{ __typename?: 'User', _id: any }>, messages: Array<{ __typename?: 'Message', _id: any, text: string, sender?: { __typename?: 'User', _id: any, fullname: string, profileImg?: { __typename?: 'Image', url: string } | null } | null }>, group?: { __typename?: 'Group', name: string, image?: { __typename?: 'Image', url: string } | null } | null } };

export type GetSingleChatQueryVariables = Exact<{
  recipientUsername: Scalars['String'];
}>;


export type GetSingleChatQuery = { __typename?: 'Query', getSingleChat: { __typename?: 'SingleChat', chat?: { __typename?: 'Chat', _id: any, users: Array<{ __typename?: 'User', _id: any }>, messages: Array<{ __typename?: 'Message', _id: any, text: string, sender?: { __typename?: 'User', _id: any, fullname: string, profileImg?: { __typename?: 'Image', url: string } | null } | null }> } | null, recipient: { __typename?: 'User', _id: any, fullname: string, profileImg?: { __typename?: 'Image', url: string } | null } } };

export type GetUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', _id: any, fullname: string, profileImg?: { __typename?: 'Image', url: string } | null } };

export type GetUsersQueryVariables = Exact<{
  searchOptions: GetUsersInput;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', _id: any, username: string, fullname: string, isNewUser?: boolean | null, profileImg?: { __typename?: 'Image', url: string } | null }> };

export type OnNewMessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNewMessageAddedSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'NewMessage', chatId: any, message: { __typename?: 'Message', text: string, _id: any, sender?: { __typename?: 'User', _id: any } | null }, users?: Array<{ __typename?: 'User', _id: any, username: string, fullname: string, profileImg?: { __typename?: 'Image', url: string } | null }> | null, group?: { __typename?: 'Group', name: string, admins: Array<{ __typename?: 'User', _id: any }>, image?: { __typename?: 'Image', url: string } | null } | null } };

export type OnNewUserAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNewUserAddedSubscription = { __typename?: 'Subscription', newUser: { __typename?: 'User', _id: any, fullname: string, username: string, isNewUser?: boolean | null, profileImg?: { __typename?: 'Image', url: string } | null } };

export type UpdateChatLastSeenMutationVariables = Exact<{
  chatId: Scalars['ObjectId'];
}>;


export type UpdateChatLastSeenMutation = { __typename?: 'Mutation', updateChatLastSeen: boolean };

export type AddUsersToGroupMutationVariables = Exact<{
  addUsersArgs: AddUsersToGroupInput;
}>;


export type AddUsersToGroupMutation = { __typename?: 'Mutation', addUsersToGroup: { __typename?: 'Chat', _id: any } };

export type AppointAdminMutationVariables = Exact<{
  appointAdminArgs: GroupOperationInput;
}>;


export type AppointAdminMutation = { __typename?: 'Mutation', appointAdmin: { __typename?: 'Chat', _id: any } };

export type ChangeGroupNameMutationVariables = Exact<{
  changeGroupNameArgs: ChangeGroupNameArgs;
}>;


export type ChangeGroupNameMutation = { __typename?: 'Mutation', changeGroupName: { __typename?: 'Chat', _id: any } };

export type DeleteGroupImageMutationVariables = Exact<{
  chatId: Scalars['ObjectId'];
}>;


export type DeleteGroupImageMutation = { __typename?: 'Mutation', deleteGroupImage: { __typename?: 'Chat', _id: any } };

export type GetGroupDataQueryVariables = Exact<{
  chatId: Scalars['String'];
}>;


export type GetGroupDataQuery = { __typename?: 'Query', getGroupData: { __typename?: 'Chat', _id: any, users: Array<{ __typename?: 'User', _id: any, fullname: string, username: string, profileImg?: { __typename?: 'Image', url: string } | null }>, group?: { __typename?: 'Group', name: string, admins: Array<{ __typename?: 'User', _id: any }>, image?: { __typename?: 'Image', url: string } | null } | null } };

export type LeaveGroupMutationVariables = Exact<{
  chatId: Scalars['String'];
}>;


export type LeaveGroupMutation = { __typename?: 'Mutation', leaveGroup: { __typename?: 'Chat', _id: any } };

export type CreateNewGroupMutationVariables = Exact<{
  groupData: NewGroupInput;
}>;


export type CreateNewGroupMutation = { __typename?: 'Mutation', createNewGroup: { __typename?: 'Chat', _id: any } };

export type RemoveAdminMutationVariables = Exact<{
  removeAdminArgs: GroupOperationInput;
}>;


export type RemoveAdminMutation = { __typename?: 'Mutation', removeAdmin: { __typename?: 'Chat', _id: any } };

export type RemoveFromGroupMutationVariables = Exact<{
  removeFromGroupArgs: GroupOperationInput;
}>;


export type RemoveFromGroupMutation = { __typename?: 'Mutation', removeFromGroup: { __typename?: 'Chat', _id: any } };

export type SetGroupImageMutationVariables = Exact<{
  file: Scalars['Upload'];
  chatId: Scalars['ObjectId'];
}>;


export type SetGroupImageMutation = { __typename?: 'Mutation', setGroupImage: { __typename?: 'Chat', _id: any } };

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
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
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
    token
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logout
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
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
export const CreateNewChatDocument = gql`
    mutation CreateNewChat($chatData: NewChatInput!) {
  createNewChat(chatData: $chatData) {
    _id
  }
}
    `;
export type CreateNewChatMutationFn = Apollo.MutationFunction<CreateNewChatMutation, CreateNewChatMutationVariables>;

/**
 * __useCreateNewChatMutation__
 *
 * To run a mutation, you first call `useCreateNewChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewChatMutation, { data, loading, error }] = useCreateNewChatMutation({
 *   variables: {
 *      chatData: // value for 'chatData'
 *   },
 * });
 */
export function useCreateNewChatMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewChatMutation, CreateNewChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewChatMutation, CreateNewChatMutationVariables>(CreateNewChatDocument, options);
      }
export type CreateNewChatMutationHookResult = ReturnType<typeof useCreateNewChatMutation>;
export type CreateNewChatMutationResult = Apollo.MutationResult<CreateNewChatMutation>;
export type CreateNewChatMutationOptions = Apollo.BaseMutationOptions<CreateNewChatMutation, CreateNewChatMutationVariables>;
export const GetChatsDocument = gql`
    query GetChats {
  getChats {
    _id
    users {
      _id
      username
      fullname
      profileImg {
        url
      }
    }
    messages {
      _id
      text
      sender {
        _id
      }
    }
    group {
      name
      admins {
        _id
      }
      image {
        url
      }
    }
    unreadMessages
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
    profileImg {
      url
    }
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
export const GetGroupChatDocument = gql`
    query GetGroupChat($chatId: ObjectId!) {
  getGroupChat(chatId: $chatId) {
    _id
    users {
      _id
    }
    messages {
      _id
      sender {
        _id
        fullname
        profileImg {
          url
        }
      }
      text
    }
    group {
      name
      image {
        url
      }
    }
  }
}
    `;

/**
 * __useGetGroupChatQuery__
 *
 * To run a query within a React component, call `useGetGroupChatQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGroupChatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGroupChatQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useGetGroupChatQuery(baseOptions: Apollo.QueryHookOptions<GetGroupChatQuery, GetGroupChatQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGroupChatQuery, GetGroupChatQueryVariables>(GetGroupChatDocument, options);
      }
export function useGetGroupChatLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGroupChatQuery, GetGroupChatQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGroupChatQuery, GetGroupChatQueryVariables>(GetGroupChatDocument, options);
        }
export type GetGroupChatQueryHookResult = ReturnType<typeof useGetGroupChatQuery>;
export type GetGroupChatLazyQueryHookResult = ReturnType<typeof useGetGroupChatLazyQuery>;
export type GetGroupChatQueryResult = Apollo.QueryResult<GetGroupChatQuery, GetGroupChatQueryVariables>;
export const GetSingleChatDocument = gql`
    query GetSingleChat($recipientUsername: String!) {
  getSingleChat(recipientUsername: $recipientUsername) {
    chat {
      _id
      users {
        _id
      }
      messages {
        _id
        sender {
          _id
          fullname
          profileImg {
            url
          }
        }
        text
      }
    }
    recipient {
      _id
      fullname
      profileImg {
        url
      }
    }
  }
}
    `;

/**
 * __useGetSingleChatQuery__
 *
 * To run a query within a React component, call `useGetSingleChatQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSingleChatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSingleChatQuery({
 *   variables: {
 *      recipientUsername: // value for 'recipientUsername'
 *   },
 * });
 */
export function useGetSingleChatQuery(baseOptions: Apollo.QueryHookOptions<GetSingleChatQuery, GetSingleChatQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSingleChatQuery, GetSingleChatQueryVariables>(GetSingleChatDocument, options);
      }
export function useGetSingleChatLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSingleChatQuery, GetSingleChatQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSingleChatQuery, GetSingleChatQueryVariables>(GetSingleChatDocument, options);
        }
export type GetSingleChatQueryHookResult = ReturnType<typeof useGetSingleChatQuery>;
export type GetSingleChatLazyQueryHookResult = ReturnType<typeof useGetSingleChatLazyQuery>;
export type GetSingleChatQueryResult = Apollo.QueryResult<GetSingleChatQuery, GetSingleChatQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($username: String!) {
  getUser(username: $username) {
    _id
    fullname
    profileImg {
      url
    }
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
    query GetUsers($searchOptions: GetUsersInput!) {
  getUsers(searchOptions: $searchOptions) {
    _id
    username
    fullname
    profileImg {
      url
    }
    isNewUser
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
 *      searchOptions: // value for 'searchOptions'
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
    users {
      _id
      username
      fullname
      profileImg {
        url
      }
    }
    group {
      name
      admins {
        _id
      }
      image {
        url
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
    profileImg {
      url
    }
    isNewUser
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
export const UpdateChatLastSeenDocument = gql`
    mutation UpdateChatLastSeen($chatId: ObjectId!) {
  updateChatLastSeen(chatId: $chatId)
}
    `;
export type UpdateChatLastSeenMutationFn = Apollo.MutationFunction<UpdateChatLastSeenMutation, UpdateChatLastSeenMutationVariables>;

/**
 * __useUpdateChatLastSeenMutation__
 *
 * To run a mutation, you first call `useUpdateChatLastSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChatLastSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChatLastSeenMutation, { data, loading, error }] = useUpdateChatLastSeenMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useUpdateChatLastSeenMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChatLastSeenMutation, UpdateChatLastSeenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChatLastSeenMutation, UpdateChatLastSeenMutationVariables>(UpdateChatLastSeenDocument, options);
      }
export type UpdateChatLastSeenMutationHookResult = ReturnType<typeof useUpdateChatLastSeenMutation>;
export type UpdateChatLastSeenMutationResult = Apollo.MutationResult<UpdateChatLastSeenMutation>;
export type UpdateChatLastSeenMutationOptions = Apollo.BaseMutationOptions<UpdateChatLastSeenMutation, UpdateChatLastSeenMutationVariables>;
export const AddUsersToGroupDocument = gql`
    mutation AddUsersToGroup($addUsersArgs: AddUsersToGroupInput!) {
  addUsersToGroup(addUsersArgs: $addUsersArgs) {
    _id
  }
}
    `;
export type AddUsersToGroupMutationFn = Apollo.MutationFunction<AddUsersToGroupMutation, AddUsersToGroupMutationVariables>;

/**
 * __useAddUsersToGroupMutation__
 *
 * To run a mutation, you first call `useAddUsersToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUsersToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUsersToGroupMutation, { data, loading, error }] = useAddUsersToGroupMutation({
 *   variables: {
 *      addUsersArgs: // value for 'addUsersArgs'
 *   },
 * });
 */
export function useAddUsersToGroupMutation(baseOptions?: Apollo.MutationHookOptions<AddUsersToGroupMutation, AddUsersToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUsersToGroupMutation, AddUsersToGroupMutationVariables>(AddUsersToGroupDocument, options);
      }
export type AddUsersToGroupMutationHookResult = ReturnType<typeof useAddUsersToGroupMutation>;
export type AddUsersToGroupMutationResult = Apollo.MutationResult<AddUsersToGroupMutation>;
export type AddUsersToGroupMutationOptions = Apollo.BaseMutationOptions<AddUsersToGroupMutation, AddUsersToGroupMutationVariables>;
export const AppointAdminDocument = gql`
    mutation AppointAdmin($appointAdminArgs: GroupOperationInput!) {
  appointAdmin(appointAdminArgs: $appointAdminArgs) {
    _id
  }
}
    `;
export type AppointAdminMutationFn = Apollo.MutationFunction<AppointAdminMutation, AppointAdminMutationVariables>;

/**
 * __useAppointAdminMutation__
 *
 * To run a mutation, you first call `useAppointAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppointAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appointAdminMutation, { data, loading, error }] = useAppointAdminMutation({
 *   variables: {
 *      appointAdminArgs: // value for 'appointAdminArgs'
 *   },
 * });
 */
export function useAppointAdminMutation(baseOptions?: Apollo.MutationHookOptions<AppointAdminMutation, AppointAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AppointAdminMutation, AppointAdminMutationVariables>(AppointAdminDocument, options);
      }
export type AppointAdminMutationHookResult = ReturnType<typeof useAppointAdminMutation>;
export type AppointAdminMutationResult = Apollo.MutationResult<AppointAdminMutation>;
export type AppointAdminMutationOptions = Apollo.BaseMutationOptions<AppointAdminMutation, AppointAdminMutationVariables>;
export const ChangeGroupNameDocument = gql`
    mutation ChangeGroupName($changeGroupNameArgs: ChangeGroupNameArgs!) {
  changeGroupName(changeGroupNameArgs: $changeGroupNameArgs) {
    _id
  }
}
    `;
export type ChangeGroupNameMutationFn = Apollo.MutationFunction<ChangeGroupNameMutation, ChangeGroupNameMutationVariables>;

/**
 * __useChangeGroupNameMutation__
 *
 * To run a mutation, you first call `useChangeGroupNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeGroupNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeGroupNameMutation, { data, loading, error }] = useChangeGroupNameMutation({
 *   variables: {
 *      changeGroupNameArgs: // value for 'changeGroupNameArgs'
 *   },
 * });
 */
export function useChangeGroupNameMutation(baseOptions?: Apollo.MutationHookOptions<ChangeGroupNameMutation, ChangeGroupNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeGroupNameMutation, ChangeGroupNameMutationVariables>(ChangeGroupNameDocument, options);
      }
export type ChangeGroupNameMutationHookResult = ReturnType<typeof useChangeGroupNameMutation>;
export type ChangeGroupNameMutationResult = Apollo.MutationResult<ChangeGroupNameMutation>;
export type ChangeGroupNameMutationOptions = Apollo.BaseMutationOptions<ChangeGroupNameMutation, ChangeGroupNameMutationVariables>;
export const DeleteGroupImageDocument = gql`
    mutation DeleteGroupImage($chatId: ObjectId!) {
  deleteGroupImage(chatId: $chatId) {
    _id
  }
}
    `;
export type DeleteGroupImageMutationFn = Apollo.MutationFunction<DeleteGroupImageMutation, DeleteGroupImageMutationVariables>;

/**
 * __useDeleteGroupImageMutation__
 *
 * To run a mutation, you first call `useDeleteGroupImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGroupImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGroupImageMutation, { data, loading, error }] = useDeleteGroupImageMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useDeleteGroupImageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGroupImageMutation, DeleteGroupImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGroupImageMutation, DeleteGroupImageMutationVariables>(DeleteGroupImageDocument, options);
      }
export type DeleteGroupImageMutationHookResult = ReturnType<typeof useDeleteGroupImageMutation>;
export type DeleteGroupImageMutationResult = Apollo.MutationResult<DeleteGroupImageMutation>;
export type DeleteGroupImageMutationOptions = Apollo.BaseMutationOptions<DeleteGroupImageMutation, DeleteGroupImageMutationVariables>;
export const GetGroupDataDocument = gql`
    query GetGroupData($chatId: String!) {
  getGroupData(chatId: $chatId) {
    _id
    users {
      _id
      fullname
      username
      profileImg {
        url
      }
    }
    group {
      name
      admins {
        _id
      }
      image {
        url
      }
    }
  }
}
    `;

/**
 * __useGetGroupDataQuery__
 *
 * To run a query within a React component, call `useGetGroupDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGroupDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGroupDataQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useGetGroupDataQuery(baseOptions: Apollo.QueryHookOptions<GetGroupDataQuery, GetGroupDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGroupDataQuery, GetGroupDataQueryVariables>(GetGroupDataDocument, options);
      }
export function useGetGroupDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGroupDataQuery, GetGroupDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGroupDataQuery, GetGroupDataQueryVariables>(GetGroupDataDocument, options);
        }
export type GetGroupDataQueryHookResult = ReturnType<typeof useGetGroupDataQuery>;
export type GetGroupDataLazyQueryHookResult = ReturnType<typeof useGetGroupDataLazyQuery>;
export type GetGroupDataQueryResult = Apollo.QueryResult<GetGroupDataQuery, GetGroupDataQueryVariables>;
export const LeaveGroupDocument = gql`
    mutation LeaveGroup($chatId: String!) {
  leaveGroup(chatId: $chatId) {
    _id
  }
}
    `;
export type LeaveGroupMutationFn = Apollo.MutationFunction<LeaveGroupMutation, LeaveGroupMutationVariables>;

/**
 * __useLeaveGroupMutation__
 *
 * To run a mutation, you first call `useLeaveGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveGroupMutation, { data, loading, error }] = useLeaveGroupMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useLeaveGroupMutation(baseOptions?: Apollo.MutationHookOptions<LeaveGroupMutation, LeaveGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument, options);
      }
export type LeaveGroupMutationHookResult = ReturnType<typeof useLeaveGroupMutation>;
export type LeaveGroupMutationResult = Apollo.MutationResult<LeaveGroupMutation>;
export type LeaveGroupMutationOptions = Apollo.BaseMutationOptions<LeaveGroupMutation, LeaveGroupMutationVariables>;
export const CreateNewGroupDocument = gql`
    mutation CreateNewGroup($groupData: NewGroupInput!) {
  createNewGroup(groupData: $groupData) {
    _id
  }
}
    `;
export type CreateNewGroupMutationFn = Apollo.MutationFunction<CreateNewGroupMutation, CreateNewGroupMutationVariables>;

/**
 * __useCreateNewGroupMutation__
 *
 * To run a mutation, you first call `useCreateNewGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewGroupMutation, { data, loading, error }] = useCreateNewGroupMutation({
 *   variables: {
 *      groupData: // value for 'groupData'
 *   },
 * });
 */
export function useCreateNewGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewGroupMutation, CreateNewGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewGroupMutation, CreateNewGroupMutationVariables>(CreateNewGroupDocument, options);
      }
export type CreateNewGroupMutationHookResult = ReturnType<typeof useCreateNewGroupMutation>;
export type CreateNewGroupMutationResult = Apollo.MutationResult<CreateNewGroupMutation>;
export type CreateNewGroupMutationOptions = Apollo.BaseMutationOptions<CreateNewGroupMutation, CreateNewGroupMutationVariables>;
export const RemoveAdminDocument = gql`
    mutation RemoveAdmin($removeAdminArgs: GroupOperationInput!) {
  removeAdmin(removeAdminArgs: $removeAdminArgs) {
    _id
  }
}
    `;
export type RemoveAdminMutationFn = Apollo.MutationFunction<RemoveAdminMutation, RemoveAdminMutationVariables>;

/**
 * __useRemoveAdminMutation__
 *
 * To run a mutation, you first call `useRemoveAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAdminMutation, { data, loading, error }] = useRemoveAdminMutation({
 *   variables: {
 *      removeAdminArgs: // value for 'removeAdminArgs'
 *   },
 * });
 */
export function useRemoveAdminMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAdminMutation, RemoveAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAdminMutation, RemoveAdminMutationVariables>(RemoveAdminDocument, options);
      }
export type RemoveAdminMutationHookResult = ReturnType<typeof useRemoveAdminMutation>;
export type RemoveAdminMutationResult = Apollo.MutationResult<RemoveAdminMutation>;
export type RemoveAdminMutationOptions = Apollo.BaseMutationOptions<RemoveAdminMutation, RemoveAdminMutationVariables>;
export const RemoveFromGroupDocument = gql`
    mutation RemoveFromGroup($removeFromGroupArgs: GroupOperationInput!) {
  removeFromGroup(removeFromGroupArgs: $removeFromGroupArgs) {
    _id
  }
}
    `;
export type RemoveFromGroupMutationFn = Apollo.MutationFunction<RemoveFromGroupMutation, RemoveFromGroupMutationVariables>;

/**
 * __useRemoveFromGroupMutation__
 *
 * To run a mutation, you first call `useRemoveFromGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromGroupMutation, { data, loading, error }] = useRemoveFromGroupMutation({
 *   variables: {
 *      removeFromGroupArgs: // value for 'removeFromGroupArgs'
 *   },
 * });
 */
export function useRemoveFromGroupMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFromGroupMutation, RemoveFromGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFromGroupMutation, RemoveFromGroupMutationVariables>(RemoveFromGroupDocument, options);
      }
export type RemoveFromGroupMutationHookResult = ReturnType<typeof useRemoveFromGroupMutation>;
export type RemoveFromGroupMutationResult = Apollo.MutationResult<RemoveFromGroupMutation>;
export type RemoveFromGroupMutationOptions = Apollo.BaseMutationOptions<RemoveFromGroupMutation, RemoveFromGroupMutationVariables>;
export const SetGroupImageDocument = gql`
    mutation SetGroupImage($file: Upload!, $chatId: ObjectId!) {
  setGroupImage(file: $file, chatId: $chatId) {
    _id
  }
}
    `;
export type SetGroupImageMutationFn = Apollo.MutationFunction<SetGroupImageMutation, SetGroupImageMutationVariables>;

/**
 * __useSetGroupImageMutation__
 *
 * To run a mutation, you first call `useSetGroupImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetGroupImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setGroupImageMutation, { data, loading, error }] = useSetGroupImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useSetGroupImageMutation(baseOptions?: Apollo.MutationHookOptions<SetGroupImageMutation, SetGroupImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetGroupImageMutation, SetGroupImageMutationVariables>(SetGroupImageDocument, options);
      }
export type SetGroupImageMutationHookResult = ReturnType<typeof useSetGroupImageMutation>;
export type SetGroupImageMutationResult = Apollo.MutationResult<SetGroupImageMutation>;
export type SetGroupImageMutationOptions = Apollo.BaseMutationOptions<SetGroupImageMutation, SetGroupImageMutationVariables>;
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