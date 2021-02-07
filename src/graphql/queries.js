/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID) {
    getRoom(id: $id) {
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
export const listMessagesForRoom = /* GraphQL */ `
  query ListMessagesForRoom($roomId: ID, $sortDirection: ModelSortDirection) {
    listMessagesForRoom(roomId: $roomId, sortDirection: $sortDirection) {
      items {
        id
        content
        owner
        createdAt
        roomId
      }
      nextToken
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms($limit: Int) {
    listRooms(limit: $limit) {
      items {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
