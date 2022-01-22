const fileSelector = document.getElementById('myFiles');
let fileList = undefined;
let str = '';
let list = [];
let os = undefined;


fileSelector.addEventListener('change', (event) => {
    fileList = event.target.files;
    console.log(fileList);
});

function printFile(file) {
    file = fileList[0];
    const reader = new FileReader();
    reader.onload = function (evt) {
        str = evt.target.result;
    };
    reader.readAsText(file);
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