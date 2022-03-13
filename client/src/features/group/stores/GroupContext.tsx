import { ReactNode, createContext, useContext, useReducer } from "react";

import { User } from "@/types";
import { sampleGroup } from "@/sampleData";

type State = {
  admins: User[];
  isAdmin: boolean;
  members: User[];
  name: string;
};
type Action =
  | { type: "ADD_ADMIN"; payload: { userId: string } }
  | { type: "REMOVE_ADMIN"; payload: { userId: string } }
  | { type: "ADD_MEMBERS"; payload: { usersId: string[] } }
  | { type: "REMOVE_MEMBER"; payload: { userId: string } }
  | { type: "UPLOAD_IMAGE"; payload: { image: Blob } }
  | { type: "DELETE_IMAGE" }
  | { type: "UPDATE_NAME"; payload: { newName: string } };
type Dispatch = (action: Action) => void;
type GroupProviderProps = { children: ReactNode };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ADD_ADMIN":
      console.log(`Adding admin ${action.payload.userId}`);
      return state;
    case "REMOVE_ADMIN":
      console.log(`Removing admin ${action.payload.userId}`);
      return state;
    case "ADD_MEMBERS":
      console.log(`Adding users ${action.payload.usersId}`);
      return state;
    case "REMOVE_MEMBER":
      console.log(`Removing member ${action.payload.userId}`);
      return state;
    case "UPLOAD_IMAGE":
      console.log(`Uploading image ${action.payload.image}`);
      return state;
    case "DELETE_IMAGE":
      console.log("Deleting Image");
      return state;
    case "UPDATE_NAME":
      console.log(
        `Updating name from ${state.name} to ${action.payload.newName}`
      );
      return state;
    default:
      return state;
  }
};

const initialState: State = {
  admins: sampleGroup.group.admins,
  isAdmin: true,
  members: sampleGroup.users,
  name: sampleGroup.group.name,
};

const GroupContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
};

export const GroupProvider = (props: GroupProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = { state, dispatch };

  return (
    <GroupContext.Provider value={contextValue}>
      {props.children}
    </GroupContext.Provider>
  );
};
