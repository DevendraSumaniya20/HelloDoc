import { gql } from '@apollo/client';

export const CHAT_MUTATION = gql`
  mutation Chat($userMessage: String!) {
    chat(userMessage: $userMessage) {
      role
      content
    }
  }
`;
