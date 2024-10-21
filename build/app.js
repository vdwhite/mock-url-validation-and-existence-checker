"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userInput = document.getElementById('userInput');
const output = document.getElementById('validate-result');
const allowedProtocol = ['http', 'https'];
const FAKEDOMAINCOM = 'fakedomain.com';
const FAKEDOMAINHTTPCOM = 'fake-domain-http.com';
const mockValidHostnames = [FAKEDOMAINCOM, FAKEDOMAINHTTPCOM];
//Function to perform throttling
const throttle = (funct, wait) => {
    let inThrottleState;
    let lastFunction;
    let lastTimestamp;
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this;
            if (!inThrottleState) {
                inThrottleState = true;
                const result = yield funct.apply(context, args);
                lastTimestamp = Date.now();
                setTimeout(() => {
                    inThrottleState = false;
                }, wait);
                return result;
            }
            else {
                clearTimeout(lastFunction);
                lastFunction = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    if (Date.now() - lastTimestamp > wait) {
                        const result = yield funct.apply(context, args);
                        lastTimestamp = Date.now();
                        return result;
                    }
                    //To prevent negative number if time between now and last timestamp is too long
                }), Math.max(wait - (Date.now() - lastTimestamp), 0));
            }
        });
    };
};
//Receives URL object when we make the call. Determine if exists
const existenceServerCall = (URL) => __awaiter(void 0, void 0, void 0, function* () {
    // Check host then check path
    if (mockValidHostnames.includes(URL === null || URL === void 0 ? void 0 : URL.hostname.toLowerCase())) {
        const URLHostName = URL.hostname.toLowerCase();
        //Assume case sensitive matter
        const pathNames = URL.pathname.split('/');
        switch (URLHostName) {
            case FAKEDOMAINCOM:
                //This domain can only be HTTPS
                if (URL.protocol.toLowerCase().replace(':', '') !== allowedProtocol[1]) {
                    return {
                        exist: false,
                    };
                }
                if (URL.pathname === '/') {
                    return {
                        exist: true,
                        isFolder: true,
                    };
                }
                else if ((pathNames.length === 2 && pathNames[1] === 'fake-path') ||
                    (pathNames.length === 3 &&
                        pathNames[1] === 'fake-path' &&
                        pathNames[2] === '')) {
                    // if level 1 is fake-path,and nothing in next elvel
                    return {
                        exist: true,
                        isFolder: true,
                    };
                }
                else if (pathNames.length === 3 &&
                    pathNames[1] === 'fake-path' &&
                    pathNames[2] === 'fake-files') {
                    return {
                        exist: true,
                        isFolder: true,
                    };
                }
                else if (pathNames.length === 4 &&
                    pathNames[2] === 'fake-files' &&
                    (pathNames[3] === '' || pathNames[3] === 'faketext.txt')) {
                    // if level 2 is fake-files, it can either be nothing or faketext.txt on level 3
                    return {
                        exist: true,
                        isFolder: pathNames[3] !== 'faketext.txt',
                        isFile: pathNames[3] === 'faketext.txt',
                    };
                }
                return {
                    exist: false,
                };
            case FAKEDOMAINHTTPCOM:
                //This domain can only be HTTP
                if (URL.protocol.toLowerCase().replace(':', '') !== allowedProtocol[0]) {
                    return {
                        exist: false,
                    };
                }
                if (URL.pathname === '/') {
                    return {
                        exist: true,
                        isFolder: true,
                    };
                }
                else if (pathNames.length === 2 && pathNames[1] === 'fake-folder') {
                    // if level 1 is fake-folder, it can either be nothing or faketext.txt for level 2
                    return {
                        exist: true,
                        isFolder: true,
                    };
                }
                else if (pathNames.length === 3 &&
                    pathNames[1] === 'fake-folder' &&
                    (pathNames[2] === 'faketext.txt' || pathNames[2] === '')) {
                    return {
                        exist: true,
                        isFolder: pathNames[2] !== 'faketext.txt',
                        isFile: pathNames[2] === 'faketext.txt',
                    };
                }
                return {
                    exist: false,
                };
            default:
                return {
                    exist: false,
                };
        }
    }
    return {
        exist: false,
    };
});
//throttling set to 25ms to prevent user is typing too fast that cause potential miss on the input
const throttledExistenceServerCall = throttle(existenceServerCall, 25);
const existenceChecker = (isInputURLValid, inputURL) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isInputURLValid) {
        return;
    }
    //Send out to server call only when input is in valid format
    const response = yield throttledExistenceServerCall(new URL(inputURL));
    output.innerText = (response === null || response === void 0 ? void 0 : response.exist)
        ? `URL format is valid and found, it is a ${response.isFile ? 'file' : 'folder'}`
        : 'URL format is valid but does not exist';
});
const formatChecker = (input) => {
    try {
        const inputURL = new URL(input);
        if (!allowedProtocol.includes(inputURL.protocol.replace(':', ''))) {
            throw Error('Only support url with protocal FTP and HTTP/HTTPS');
        }
        return true;
    }
    catch (e) {
        return false;
    }
};
const handleInput = (event) => {
    const currentInput = event.target.value;
    const isInputURLValid = formatChecker(currentInput);
    if (!isInputURLValid) {
        output.innerText = 'Invalid URL format, please check your input';
    }
    existenceChecker(isInputURLValid, currentInput);
};
// Add event listener for input event
userInput.addEventListener('input', handleInput);
