import {getToken} from '@/utils/auth';
import {socketHostInfo} from '@/api/socket/socketCommon';
import io from 'socket.io-client';

export function createSocketLink(callback) {
    // // 链接socket
    // socketHostInfo().then(re => {
    //     if (re.data.success) {
    //         const {domain, hostName, port} = re.data.data;
    //         let url = domain;
    //         if (url) {
    //             url = `${url}?token=${getToken()}`;
    //         } else {
    //             url = `http://${hostName || location.hostname}:${port ||
    //                 location.port}?token=${getToken()}`;
    //         }
    //         window.Socket = io.connect(`${url}`);
    //         window.Socket.on('connect', function() {
    //             window.socketIsLinked = true;
    //             callback && callback();
    //             console.log('websocket connect success');
    //         });

    //         window.Socket.on('disconnect', function() {
    //             window.socketIsLinked = false;
    //             const d = new Date();
    //             console.log(
    //                 `websocket disconnect: ${d.getFullYear()}-${d.getMonth() +
    //                     1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    //             );
    //         });
    //     } else {
    //         console.log('websocket connect fail');
    //     }
    // });
}

export function socketEmit(funCode, params, callback) {
    // window.Socket.emit('socketEvent', {
    //     token: getToken(),
    //     funCode,
    //     json: JSON.stringify(params),
    //     callback
    // });
}

export function socketEvent(name, callback) {
    // window.Socket.on(name, re => {
    //     console.log('====== socket event ======');
    //     console.log('socket info', name, re);
    //     callback(re);
    // });
}
