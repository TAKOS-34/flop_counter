import { io } from 'socket.io-client';

const socket = io.connect("http://188.165.222.102:4321");


export default socket;