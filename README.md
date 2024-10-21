# mock-url-validation-and-existence-checker
A browser application that mocks checking of user input URL
The repo is written using Typescript.

To compile the files, run `npm run build` after cloning the repo to local.

# Limitations
- The mock assumes users URL have scheme of HTTP / HTTPS
- Only certain options and "domains" will be considered as "existed":
    `https://fakedomain.com/fake-path/fake-files/faketext.txt`
    `http://fake-domain-http.com/fake-folder/faketext.txt`
    and their "higher levels" (`https://fakedomain.com`, for example)
- The application does not sanitize/trim the URL input