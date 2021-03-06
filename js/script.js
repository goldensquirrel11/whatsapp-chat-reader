const fileSelector = document.getElementById('myFiles');
let fileList = undefined;
let str = '';
let os = undefined;
let username = '';


// listens for changes in files uploaded
fileSelector.addEventListener('change', (event) => {
    fileList = event.target.files;

    console.log(fileList);
});

// gets content from txt file and turns it into a string
function readFile(file) {
    file = fileList[0];
    const reader = new FileReader();
    reader.onload = function (evt) {
        str = evt.target.result;
    };
    reader.readAsText(file);

    setTimeout(function run(){
        // clear chat bubbles
        document.getElementsByClassName('chat-container')[0].innerHTML = '';

    // get OS type
        radios = document.getElementsByName('os')
        for (let radio of radios) {
            if (radio.checked) {
                os = radio.value;
            }
        }

        // set username
        username = document.getElementById('username').value;
        console.log(3);
        let obj = returnMessages(str,os);
        console.log(obj);
        readChat(obj);
    },500);
}


function isDateIOS(str){
    var s = str.search('\[[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+:[0-9]+ (PM|AM)\]');
    if (s === 0){
        return true;
    }
    else{
        return false;
    }
}

function isDateAndroid(str){
    var s = str.search('[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+ -');
    if (s === 0){
        //make sure it's starting with a date
        return true;
    }
    else{
        return false;
    }
}

function create_list(str,os){
    console.log(str)
    let list = [];
    let msg = "";
    for (var i = 0; i < str.length ; i ++){
        if (msg.length > 3){
                // msg.length > 3, make sure it's not an empty string
                if((os === "android" && isDateAndroid(str.slice(i,i+19))) || (os === "ios" && isDateIOS(str.slice(i,i+25))) ){
                    //19 is the length of the date formatted in android, and 25 is for IOS
                    list.push(msg);
                    msg = "";
                }
        }
        msg += str[i];
    }
    list.push(msg);
    return list;
}

function returnObjectAndroid(str){
    let regexp =  /([0-9]+\/[0-9]+\/[0-9]+), ([0-9]+:[0-9]+) - ((\+.+|.+))( joined using this group's invite link| left|: ((.|\n)+)*)/;
    let result = str.match(regexp);
    console.log(result);
    console.log(str);
    let author = result[3];
    let content = result[5];
    let object = {
        date : result[1],
        time : result[2],
        author: author,
        content : content
    }
    return object;
}

function returnObjectIOS(str){
    let regexp =  /\[([0-9]+\/[0-9]+\/[0-9]+), ([0-9]+:[0-9]+:[0-9]+ (PM|AM))\] ((\+.+|.+))( joined using this group's invite link| left|: ((.|\n)+)*)/;
    let result = str.match(regexp);
    //solving author , content problem
    let author = result[4];
    let content = result[6];
    if (str.search(/<attached: [\d\-\w\.]*>/) !== -1){
        let substring = author.slice(-12,author.length);
        author = author.slice(0,-12);
        content = substring + content;
    }
    let object = {
        date : result[1],
        time : result[2],
        author: author,
        content : content
    }
    return object;
}

function iosObjValidation(str){
    return ((str.search(/joined using this group's invite link/) !== -1 || str.search(/ left/) !== -1) || (str.search(/\[[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+:[0-9]+ (PM|AM)\].*:/) !== -1 && str.search(/Messages and calls are end-to-end encrypted\. No one outside of this chat, not even WhatsApp, can read or listen to them\./) === -1 && str.search(/[\+\d\s\-]+.+ changed their phone number to a new number\..+Tap to message or add the new number\./) === -1 && str.search(/\[[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+:[0-9]+ (PM|AM)\] - Your security code with .+ changed\. Tap to learn more\./) === -1 && str.search(/[\+\d\s\-]+created this group/) === -1 && str.search(/[\+\d\s\-]*.*changed the group description/)== -1 && str.search(/.+ changed this group's icon./) === -1 && str.search(/.+ added .+/) === -1));
}

function androidObjValidation(str){
    return((str.search(/joined using this group's invite link/) !== -1 || str.search(/ left/) !== -1) || (str.search(/[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+.+:/) !== -1 && str.search(/[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+ - Messages and calls are end-to-end encrypted/) === -1 && str.search(/[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+ - Your security code with .+ changed\. Tap to learn more\./ ) === -1 && str.search(/[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+ -.+created group ".+"/ ) === -1 && str.search(/[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+ - [\+\d\s\-]+ changed to [\+\d\s\-]+/ ) === -1 && str.search(/.+ added .+/) === -1 && str.search(/.+ changed the group description/) === -1 && str.search(/.+ changed this group's icon/) === -1));
}

function create_object(list,os){
    let objList = [];
    if (os === "android"){
        for (let i = 0; i < list.length ; i++){
            if (androidObjValidation(list[i])){
                let obj = returnObjectAndroid(list[i]);
                objList.push(obj);
            }
        }
    }
    else if (os === "ios"){
        for (let i = 0; i < list.length ; i++){
            if (iosObjValidation(list[i])){
                let obj = returnObjectIOS(list[i]);
                objList.push(obj);
            }
        }
    }
    return objList;
}


function returnMessages(str,os){
    console.log(str)
    let list = create_list(str,os);
    console.log(list)
    let messages = create_object(list,os);
    //messages is an Object List.
    return messages;
}


function addChat(message, time, author, isSend = false) {
    let messageDiv = document.createElement("div");
    if (isSend) {
        messageDiv.className = "msg sent-msg";
    } else {
        messageDiv.className = "msg received-msg";
    }

    let authorDiv = document.createElement("div");
    authorDiv.className = "author";
    authorDiv.append(author);

    let textDiv = document.createElement("div");
    textDiv.className = "text-content";
    textDiv.append(message);

    let timeDiv = document.createElement("div");
    timeDiv.className = "msg-time";
    timeDiv.append(time);

    messageDiv.append(authorDiv);
    messageDiv.append(textDiv);
    messageDiv.append(timeDiv);

    document.getElementsByClassName('chat-container')[0].append(messageDiv);
}

function addSystemMessage(content) {
    let message = document.createElement("div");
    message.className = 'system-message'
    message.append(content);

    document.getElementsByClassName('chat-container')[0].append(message)
}

// {
//     date: '22/08/2021',
//     time: '17:06',
//     author: '+60 13-629 6810',
//     content: ': No problem! ???'
//   }

// {
//     date: '21/08/2021',
//     time: '18:36',
//     author: '+60 11-5112 1620',
//     content: " joined using this group's invite link"
//   }


// TODO: do testing on this function once yen hong is done
// This function reads the messages that have been parsed into list of objects
function readChat(obj) {
    let date = undefined;
    obj.forEach(function (message) {
        if (date !== message.date) {
            addSystemMessage(message.date);
            date = message.date;
        }

        if (message.content.charAt(0) === ':') {
            addChat(message.content.slice(2), message.time, message.author, message.author === username);
        } else {
            addSystemMessage(message.author + message.content);
        }
    });
}