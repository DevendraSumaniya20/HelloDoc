import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GraphQLError } from 'graphql';
import { ServerError } from '@apollo/client';

// Use your actual Mac IP address
const serverURL = 'http://192.168.29.114:4000';

console.log('Apollo Client connecting to:', serverURL);

/**
 * Custom fetch with timeout support
 */


// Apollo doesn’t export this type anymore → define locally
interface CustomErrorResponse {
  graphQLErrors?: readonly GraphQLError[];
  networkError?: Error;
  operation: any;
  forward?: any;
}


const fetchWithTimeout = (
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout = 15000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(id)
  );
};

const httpLink = new HttpLink({
  uri: serverURL,
  fetch: fetchWithTimeout,
});


let token: string | null = null;

const authLink = setContext(async (_, prevContext) => {
  if (!token) {
    try {
      token = await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  }
  return {
    headers: {
      ...prevContext.headers,
      'Content-Type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = new ErrorLink(
  ({ graphQLErrors, networkError, operation }: CustomErrorResponse) => {
    if (graphQLErrors && graphQLErrors.length > 0) {
      graphQLErrors.forEach((err: GraphQLError) => {
        console.error('[GraphQL error]:', err.message);
        console.error('[GraphQL error path]:', err.path);
        console.error('[GraphQL error locations]:', err.locations);
      });
    }

    if (networkError) {
      console.error('[Network error]:', networkError);
      console.error('[Network error details]:', {
        message: networkError.message,
        name: networkError.name,
        stack: networkError.stack,
      });

      if (networkError.message.includes('Network request failed')) {
        console.error(
          'Network connection issue - check your server and IP address'
        );
      }

      if (networkError.message.includes('timeout')) {
        console.error('Request timeout - server might be slow to respond');
      }

      if ((networkError as ServerError).statusCode === 401) {
        token = null;
        AsyncStorage.removeItem('token').catch(console.error);
      }
    }

    console.error('[Failed operation]:', operation.operationName);
    console.error('[Operation variables]:', operation.variables);
  }
);

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing GraphQL connection...');
    const result = await apolloClient.query({
      query: gql`
        query TestConnection {
          __typename
        }
      `,
      fetchPolicy: 'network-only',
    });
    console.log('Connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Mutation types
type ChatResponse = {
  chat: {
    role: string;
    content: string;
  };
};

// Enhanced chat mutation with better error handling
export const sendChatMessage = async (
  userMessage: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log('Sending chat message:', userMessage);

    const result = await apolloClient.mutate<ChatResponse>({
      mutation: CHAT_MUTATION,
      variables: { userMessage },
      errorPolicy: 'all',
    });

    const { data, errors } = result as typeof result & {
      errors?: readonly GraphQLError[];
    };

    if (errors && errors.length > 0) {
      console.error('GraphQL errors:', errors);
      return {
        success: false,
        error: `GraphQL errors: ${errors
          .map((e: GraphQLError) => e.message)
          .join(', ')}`,
      };
    }

    if (!data?.chat) {
      return {
        success: false,
        error: 'No data received from server',
      };
    }

    console.log('Chat response received:', data.chat);
    return {
      success: true,
      data: data.chat,
    };
  } catch (error) {
    console.error('Chat mutation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const CHAT_MUTATION = gql`
  mutation Chat($userMessage: String!) {
    chat(userMessage: $userMessage) {
      role
      content
    }
  }
`;
