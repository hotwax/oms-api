# oms-api

The OMS API package comes with prebuilt methods that helps communicate with HotWax Commerce OMS using Rest API

# Build Notes (Users)

1. Download the package from [release](https://github.com/hotwax/oms-api/releases) page and extract it.
2. Go to the package directory.
3. Run following command to download dependencies  
    `npm i`
5. Build the package using `npm run build`

# Build Notes (Contributors)

1. Open a Terminal window.
2. Clone package using the command: `git clone https://github.com/hotwax/oms-api.git <repository-name>`
3. Go to the <repository-name> directory using command: `cd <repository-name>`
5. Run following command to download dependencies
    `npm i`
4. Build the package using `npm run build`

# Usage

1. Install OMS API package in the application using npm
```js
npm i @hotwax/oms-api
```

2. Define `init` method on app load that will be used to set the initial configuration for the package.
    > **Note:** In case of vue project, you can define it inside mounted hook in `App.vue` file
```js
import { init } from '@hotwax/oms-api'
...
...
init(token, instanceURL, cacheAge)
```

2. Add following method calls to clear the token and instance url when app unmounts. Also, you can use the same method whenever user logout from the app.
    > **Note:** In case of vue project, you can define it inside unmounted hook in `App.vue` file
```js
import { resetConfig } from '@hotwax/oms-api'
...
...
resetConfig()
```

3. Update the token or instance URL whenever needed by using the following methods:
  - `updateToken`: For updating the token value
  - `updateInstanceUrl`: For updating the instanceURL / backendURL.

4. Now you can use any method from the package by directly importing it from `@hotwax/oms-api`


# Contribution Guideline

1. Fork the repository and clone it locally from the `main` branch. Before starting your work make sure it's up to date with current `main` branch.
2. Pick an issue from [here](https://github.com/hotwax/oms-api/issues). Write in the issue comment that you want to pick it, if you can't assign yourself. **Please stay assigned to one issue at a time to not block others**.
3. Create a branch for your edits. Use the following branch naming conventions: **oms-api/issue-number**.
4. Please add issue number to your commit message.
5. Propose a Pull Request to `main` branch containing issue number and issue title.
6. Use [Pull Request template](https://github.com/hotwax/oms-api/blob/main/.github/PULL_REQUEST_TEMPLATE.md) (it's automatically added to each PR) and fill as much fields as possible to describe your solution.
7. Reference any relevant issues or other information in your PR.
8. Wait for review and adjust your PR according to it.
9. Congrats! Your PR should now be merged in!

If you can't handle some parts of the issue then please ask for help in the comment. If you have any problems during the implementation of some complex issue, feel free to implement just a part of it.

## Report a bug or request a feature

Always define the type of issue:
* Bug report
* Feature request

While writing issues, please be as specific as possible. All requests regarding support with implementation or application setup should be sent to.

# Join the community on Discord

If you have any questions or ideas feel free to join our <a href="https://discord.gg/SwpJnpdyg3" target="_blank">Discord channel</a>
    
# The license

Oms-api is completely free and released under the Apache v2.0 License. Check <a href="https://github.com/hotwax/oms-api/blob/main/LICENSE" target="_blank">LICENSE</a> for more details.
