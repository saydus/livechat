/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
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
export const onCreateMessageByRoomId = /* GraphQL */ `
  subscription OnCreateMessageByRoomId($roomId: ID) {
    onCreateMessageByRoomId(roomId: $roomId) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`;
