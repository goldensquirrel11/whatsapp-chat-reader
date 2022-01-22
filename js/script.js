const fileSelector = document.getElementById('myFiles');
let fileList = undefined;
let str = '';
let list = [];
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

    // get OS type
    radios = document.getElementsByName('os')
    for (let radio of radios) {
        if (radio.checked) {
            os = radio.value
        }
    }

    // set username
    username = document.getElementById('username').value

    // splits chat into a list of strings
    create_list(str, os);
}

function isDateApple(str){
    let s = str.search('\[[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+:[0-9]+ (PM|AM)\]');
    if (s === 0){
        return true;
    }
    else{
        return false;
    }
}

function isDateAndroid(str){
    let s = str.search('[0-9]+\/[0-9]+\/[0-9]+, [0-9]+:[0-9]+ -');
    if (s === 0){
        //make sure it's starting with a date
        return true;
    }
    else{
        return false;
    }
}

function create_list(str,os){
    let msg = "";
    for (let i = 0; i < str.length ; i ++){
        if (msg.length > 3){
                // msg.length > 3, make sure it's not an empty string
                if((os === "android" && isDateAndroid(str.slice(i,i+19))) || (os === "ios" && isDateApple(str.slice(i,i+25))) ){
                    //19 is the length of the date formatted in android, and 25 is for IOS
                    list.push(msg);
                    msg = "";
                }
        }
        msg += str[i];
    }
    list.push(msg);
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

}