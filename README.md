# my-react-hooks
There is my hooks created during projects

## UseLocalState - A hook for manipulating localStorage object. create / update / delete.
 - [x] create a key & assigning default value (ex: ```const [ name, setName, delName ] = useLocalState("name", "Baw") )```;

## UseInitToken - A hook for using access_token & refresh_token correctly.
 - [x] useLocalState to store / update / delete the access_token & refresh_token in localStorage.
 - [x] check the state of the access_token everytime it is updated & store this state in a memoryState called tokenState. TokenState { EXPIRED, MISSING, VALID }
 - [x] if the token is valid, update the token with a refresh token.

## UseTimeOut - A hook for executing an asynchronous callback. 
See [example](https://github.com/bawdeveloppement/react-usetimeout)
