/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMessage = /* GraphQL */ `
  mutation CreateMessage($input: MessageInput) {
    createMessage(input: $input) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`;
export const createRoom = /* GraphQL */ `
  mutation CreateRoom($input: RoomInput) {
    createRoom(input: $input) {
      id
      name
      messages {
        items {
          id
          content
          owner
          createdAt
          roomId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
