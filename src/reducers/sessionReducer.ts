interface Session {
    connected: boolean;
    connectedIDs: string[];
    users: UserInstance[];
}

interface UserInstance {
    sender?: string;
    userId?: string;
    room: string;
    cursor: {
        transX: number;
        transY: number;
    }
}

const sessionReducer = (state: Session, {type, payload}: any): Session => {
    switch (type) {
        case 'connect': {
            payload.socket.emit('joinRoom', {room: 'test', sender: payload.sender})
            return {...state, connected: true}
        }
        case 'disconnect': {
            payload.socket.emit('leaveRoom', 'test')
            return {...state, connected: false}
        }
        case 'setConnectedIDs': {
            return {...state, connectedIDs: payload.message.users}
        }
        case 'joined': {
            const user: UserInstance = {
                sender: payload.message.sender,
                userId: payload.message.userId,
                room: 'test',
                cursor: {
                    transX: 0, 
                    transY: 0
                }
            }
            if (state.users.length === 0) {
                const clients = payload.message.users.map((client: any) => ({
                    sender: payload.message.sender,
                    userId: client,
                    room: 'test',
                    cursor: {
                        transX: 0, 
                        transY: 0
                    }
                }))
                return {...state, users: clients}
            } else {
                return {...state, users: [...state.users, user]}
            }
        }

        case 'left': {
            return {...state, users: state.users.filter((user: UserInstance) => user.userId !== payload.message.userId)}
        }

        case 'setClientData': {
            const users: any = state.users.map((user: UserInstance) => {
                if (user.userId == payload.message.userId) {
                    return {...user, cursor: {transX: payload.message.cursor.transX, transY: payload.message.cursor.transY}, sender: payload.message.sender}
                }
                return user
            })
            return {...state, users: users}
        }

        default: {
            return state
        }
    }

}

export default sessionReducer